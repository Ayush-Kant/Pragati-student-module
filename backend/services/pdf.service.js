import PDFDocument from "pdfkit";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "../public/certificates");

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));

const fetchQrCode = async (verifyUrl) => {
  const provider = String(
    process.env.CERTIFICATE_QR_PROVIDER_URL ||
      "https://api.qrserver.com/v1/create-qr-code/",
  );
  const url = new URL(provider);
  url.searchParams.set("size", "240x240");
  url.searchParams.set("format", "png");
  url.searchParams.set("data", verifyUrl);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`QR provider returned HTTP ${response.status}`);
    }
    return Buffer.from(await response.arrayBuffer());
  } catch (error) {
    throw new Error(`Unable to generate certificate QR code: ${error.message}`);
  } finally {
    clearTimeout(timeout);
  }
};

export const generateCertificatePDF = async ({
  studentName,
  collegeName,
  driveName,
  companyName,
  skillDomain,
  score,
  completionDate,
  mentorName,
  verifyUrl,
  verificationCode,
}) => {
  await fsp.mkdir(publicDir, { recursive: true });

  const qrBuffer = await fetchQrCode(verifyUrl);
  const filename = `${String(verificationCode || "certificate").replace(/[^A-Za-z0-9-]/g, "_")}.pdf`;
  const filePath = path.join(publicDir, filename);

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        layout: "landscape",
        size: "A4",
        margin: 0,
      });
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;

      // Elegant double border.
      doc.lineWidth(2).strokeColor("#334155").rect(22, 22, pageWidth - 44, pageHeight - 44).stroke();
      doc.lineWidth(1).strokeColor("#cbd5e1").rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();

      doc.font("Helvetica-Bold").fontSize(34).fillColor("#0f172a").text("CERTIFICATE OF COMPLETION", 0, 60, {
        width: pageWidth,
        align: "center",
      });

      doc.font("Helvetica").fontSize(13).fillColor("#64748b").text("Pragati Platform certifies that", 0, 112, {
        width: pageWidth,
        align: "center",
      });

      doc.font("Helvetica-Bold").fontSize(28).fillColor("#1e293b").text(studentName || "Student", 90, 145, {
        width: pageWidth - 180,
        align: "center",
      });

      doc.moveTo(180, 184).lineTo(pageWidth - 180, 184).lineWidth(1).strokeColor("#cbd5e1").stroke();

      doc.font("Helvetica").fontSize(14).fillColor("#475569").text("has successfully completed the recruitment drive", 0, 199, {
        width: pageWidth,
        align: "center",
      });

      doc.font("Helvetica-Bold").fontSize(20).fillColor("#0f172a").text(driveName || "Recruitment Drive", 80, 226, {
        width: pageWidth - 160,
        align: "center",
      });

      doc.font("Helvetica").fontSize(12).fillColor("#475569").text(
        `${companyName || "Company"}  •  ${skillDomain || "Placement Training"}`,
        90,
        260,
        { width: pageWidth - 180, align: "center" },
      );

      if (score !== null && score !== undefined) {
        doc.font("Helvetica-Bold").fontSize(14).fillColor("#334155").text(
          `Overall Training Score: ${Number(score).toFixed(2)}%`,
          90,
          286,
          { width: pageWidth - 180, align: "center" },
        );
      }

      doc.font("Helvetica").fontSize(11).fillColor("#64748b").text(
        `Completion Date: ${formatDate(completionDate)}`,
        90,
        315,
        { width: pageWidth - 180, align: "center" },
      );

      // QR authenticity block.
      const qrSize = 118;
      const qrX = pageWidth - 178;
      const qrY = pageHeight - 182;
      doc.image(qrBuffer, qrX, qrY, { fit: [qrSize, qrSize] });
      doc.font("Helvetica-Bold").fontSize(9).fillColor("#334155").text("SCAN TO VERIFY", qrX, qrY + qrSize + 8, {
        width: qrSize,
        align: "center",
      });

      doc.font("Helvetica-Bold").fontSize(11).fillColor("#0f172a").text("Verification Code", 75, pageHeight - 152, {
        width: 235,
        align: "left",
      });
      doc.font("Helvetica").fontSize(14).fillColor("#1e293b").text(verificationCode || "N/A", 75, pageHeight - 130, {
        width: 235,
        align: "left",
      });
      doc.font("Helvetica").fontSize(8.5).fillColor("#64748b").text(verifyUrl || "", 75, pageHeight - 103, {
        width: 275,
        align: "left",
        lineBreak: false,
        ellipsis: true,
      });

      const signatureY = pageHeight - 77;
      doc.font("Helvetica-Bold").fontSize(10).fillColor("#334155").text(mentorName || "Pragati Platform", 355, signatureY, {
        width: 175,
        align: "center",
      });
      doc.moveTo(370, signatureY - 6).lineTo(515, signatureY - 6).lineWidth(1).strokeColor("#cbd5e1").stroke();
      doc.font("Helvetica").fontSize(8.5).fillColor("#64748b").text("Issuing Authority", 355, signatureY + 15, {
        width: 175,
        align: "center",
      });

      doc.font("Helvetica").fontSize(8.5).fillColor("#64748b").text(
        collegeName ? `College: ${collegeName}` : "",
        75,
        pageHeight - 58,
        { width: 275, align: "left" },
      );

      doc.end();

      writeStream.on("finish", () => {
        resolve({
          url: `/public/certificates/${filename}`,
          filePath,
          filename,
          relativePath: `public/certificates/${filename}`,
        });
      });
      writeStream.on("error", reject);
    } catch (error) {
      reject(error);
    }
  });
};
