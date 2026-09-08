import crypto from "node:crypto";
import http from "node:http";
import https from "node:https";
import { URL } from "node:url";

const trimSlash = (value = "") => String(value).replace(/\/+$/, "");

const getConfig = () => ({
  endpoint: trimSlash(process.env.S3_ENDPOINT || ""),
  bucket: String(process.env.S3_BUCKET || "").trim(),
  region: String(process.env.S3_REGION || "us-east-1").trim(),
  accessKeyId: String(process.env.S3_ACCESS_KEY_ID || "").trim(),
  secretAccessKey: String(process.env.S3_SECRET_ACCESS_KEY || "").trim(),
  forcePathStyle: String(process.env.S3_FORCE_PATH_STYLE ?? "true").toLowerCase() !== "false",
});

export const isS3Configured = () => {
  const { endpoint, bucket, region, accessKeyId, secretAccessKey } = getConfig();
  return Boolean(endpoint && bucket && region && accessKeyId && secretAccessKey);
};

const sha256Hex = (value) => crypto.createHash("sha256").update(value).digest("hex");
const hmac = (key, value, encoding) => crypto.createHmac("sha256", key).update(value).digest(encoding);
const awsEncode = (value) =>
  encodeURIComponent(String(value)).replace(/[!'()*]/g, (char) =>
    `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
  );
const encodePath = (key) => String(key).split("/").filter(Boolean).map(awsEncode).join("/");

const getTarget = (key) => {
  const { endpoint, bucket, forcePathStyle } = getConfig();
  const base = new URL(endpoint);
  const encodedKey = encodePath(key);
  if (forcePathStyle) {
    return {
      url: new URL(`${base.origin}/${awsEncode(bucket)}/${encodedKey}`),
      bucketPath: `/${awsEncode(bucket)}`,
    };
  }
  return {
    url: new URL(`${base.protocol}//${bucket}.${base.host}/${encodedKey}`),
    bucketPath: "",
  };
};

const getSigningKey = (dateStamp) => {
  const { secretAccessKey, region } = getConfig();
  const dateKey = hmac(`AWS4${secretAccessKey}`, dateStamp);
  const regionKey = hmac(dateKey, region);
  const serviceKey = hmac(regionKey, "s3");
  return hmac(serviceKey, "aws4_request");
};

const buildAuthorization = ({ method, targetUrl, payloadHash, headers, now }) => {
  const { region, accessKeyId } = getConfig();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const credentialScope = `${dateStamp}/${region}/s3/aws4_request`;
  const canonicalUri = targetUrl.pathname || "/";
  const canonicalHeaders = Object.keys(headers)
    .sort()
    .map((key) => `${key.toLowerCase()}:${String(headers[key]).trim()}\n`)
    .join("");
  const signedHeaders = Object.keys(headers).sort().map((key) => key.toLowerCase()).join(";");
  const canonicalRequest = [method, canonicalUri, "", canonicalHeaders, signedHeaders, payloadHash].join("\n");
  const stringToSign = ["AWS4-HMAC-SHA256", amzDate, credentialScope, sha256Hex(canonicalRequest)].join("\n");
  const signature = hmac(getSigningKey(dateStamp), stringToSign, "hex");
  return {
    amzDate,
    authorization:
      `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, ` +
      `SignedHeaders=${signedHeaders}, Signature=${signature}`,
  };
};

const request = ({ method, url, headers, body }) =>
  new Promise((resolve, reject) => {
    const transport = url.protocol === "https:" ? https : http;
    const req = transport.request(url, { method, headers }, (res) => {
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        const responseBody = Buffer.concat(chunks);
        const statusCode = Number(res.statusCode || 0);
        if (statusCode >= 200 && statusCode < 300) {
          resolve({ statusCode, headers: res.headers, body: responseBody });
          return;
        }
        reject(new Error(`Certificate storage request failed (${statusCode}): ${responseBody.toString("utf8").slice(0, 500)}`));
      });
    });
    req.setTimeout(15000, () => req.destroy(new Error("Certificate storage request timed out")));
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });

export const uploadCertificate = async ({ key, body, contentType = "application/pdf" }) => {
  if (!isS3Configured()) throw new Error("S3 certificate storage is not configured");
  const target = getTarget(key);
  const payloadHash = sha256Hex(body);
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const { authorization } = buildAuthorization({
    method: "PUT",
    targetUrl: target.url,
    payloadHash,
    headers: {
      host: target.url.host,
      "content-type": contentType,
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": amzDate,
    },
    now,
  });

  await request({
    method: "PUT",
    url: target.url,
    headers: {
      host: target.url.host,
      "content-type": contentType,
      "content-length": String(body.length),
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": amzDate,
      authorization,
    },
    body,
  });

  const { bucket } = getConfig();
  return {
    key,
    provider: "s3",
    publicUrl: process.env.S3_PUBLIC_BASE_URL
      ? `${trimSlash(process.env.S3_PUBLIC_BASE_URL)}/${encodePath(key)}`
      : `s3://${bucket}/${key}`,
  };
};

export const createSignedDownloadUrl = ({ key, expiresInSeconds = 3600 }) => {
  if (!isS3Configured()) return null;
  const { region, accessKeyId } = getConfig();
  const target = getTarget(key);
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const credentialScope = `${dateStamp}/${region}/s3/aws4_request`;
  const signedHeaders = "host";
  const expires = Math.max(1, Math.min(Number(expiresInSeconds) || 3600, 604800));
  const query = new Map([
    ["X-Amz-Algorithm", "AWS4-HMAC-SHA256"],
    ["X-Amz-Credential", `${accessKeyId}/${credentialScope}`],
    ["X-Amz-Date", amzDate],
    ["X-Amz-Expires", String(expires)],
    ["X-Amz-SignedHeaders", signedHeaders],
  ]);
  const canonicalQuery = [...query.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([keyName, value]) => `${awsEncode(keyName)}=${awsEncode(value)}`)
    .join("&");
  const canonicalRequest = ["GET", target.url.pathname || "/", canonicalQuery, `host:${target.url.host}\n`, signedHeaders, "UNSIGNED-PAYLOAD"].join("\n");
  const stringToSign = ["AWS4-HMAC-SHA256", amzDate, credentialScope, sha256Hex(canonicalRequest)].join("\n");
  const signature = hmac(getSigningKey(dateStamp), stringToSign, "hex");
  return `${target.url.origin}${target.url.pathname}?${canonicalQuery}&X-Amz-Signature=${signature}`;
};

export default { isS3Configured, uploadCertificate, createSignedDownloadUrl };
