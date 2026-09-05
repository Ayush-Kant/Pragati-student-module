import { existsSync, copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import net from "node:net";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const backendDir = path.join(root, "backend");
const frontendDir = path.join(root, "frontend");
const backendEnv = path.join(backendDir, ".env");
const backendEnvTemplate = path.join(backendDir, ".env.intern.example");
const frontendEnv = path.join(frontendDir, ".env.local");

const LOCAL_PORTS = {
  postgres: 55432,
  redis: 56379,
  firebaseUi: 54000,
  firestore: 58080,
  firebaseAuth: 59099,
};

const run = (command, args, cwd = root) => {
  console.log(`\n> ${command} ${args.join(" ")}`);
  execFileSync(command, args, {
    cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
};

const commandExists = (command) => {
  try {
    run(process.platform === "win32" ? "where" : "which", [command]);
    return true;
  } catch {
    return false;
  }
};

const portIsBusy = (port) =>
  new Promise((resolve) => {
    const socket = net.createConnection({ host: "127.0.0.1", port });
    let settled = false;

    const finish = (busy) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(busy);
    };

    socket.setTimeout(500, () => finish(false));
    socket.once("connect", () => finish(true));
    socket.once("error", (error) => finish(error.code !== "ECONNREFUSED"));
  });

const waitForPort = async (name, port, attempts = 60) => {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    if (await portIsBusy(port)) {
      console.log(`✓ ${name} is listening on 127.0.0.1:${port}`);
      return;
    }

    if (attempt < attempts) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  throw new Error(
    `${name} did not become reachable on 127.0.0.1:${port} within ${attempts} seconds. ` +
      "Run `docker compose ps` and `docker compose logs firebase` (or the relevant service) for details."
  );
};

const ensureBackendEnv = () => {
  if (!existsSync(backendEnvTemplate)) {
    throw new Error("backend/.env.intern.example is missing.");
  }

  if (!existsSync(backendEnv)) {
    copyFileSync(backendEnvTemplate, backendEnv);
    console.log("✓ Created backend/.env from the intern template.");
    return;
  }

  const requiredValues = {
    PORT: "5000",
    NODE_ENV: "development",
    POSTGRESQL_URI: "postgresql://postgres:postgres@127.0.0.1:55432/pragati_dev",
    JWT_SECRET: "pragati-local-development-secret",
    JWT_EXPIRES_IN: "7d",
    STUDENT_JWT_EXPIRES_IN: "15m",
    STUDENT_REFRESH_TTL_DAYS: "7",
    PUBLIC_API_URL: "http://localhost:5000",
    CLIENT_URL: "http://localhost:5173",
    REDIS_URL: "redis://127.0.0.1:56379",
    FIREBASE_PROJECT_ID: "pragati-local",
    FIREBASE_AUTH_EMULATOR_HOST: "127.0.0.1:59099",
    FIRESTORE_EMULATOR_HOST: "127.0.0.1:58080",
  };

  let envText = readFileSync(backendEnv, "utf8");
  let changed = false;

  for (const [key, value] of Object.entries(requiredValues)) {
    const pattern = new RegExp(`^${key}=.*$`, "m");
    const replacement = `${key}=${value}`;

    if (pattern.test(envText)) {
      const next = envText.replace(pattern, replacement);
      if (next !== envText) changed = true;
      envText = next;
    } else {
      envText = `${envText.trimEnd()}\n${replacement}\n`;
      changed = true;
    }
  }

  if (changed) {
    writeFileSync(backendEnv, envText);
    console.log("✓ Updated local infrastructure settings in backend/.env.");
  } else {
    console.log("✓ backend/.env already uses the intern local configuration.");
  }
};

const ensureFrontendEnv = () => {
  const requiredValues = {
    VITE_FIREBASE_API_KEY: "pragati-local-development-key",
    VITE_FIREBASE_AUTH_DOMAIN: "pragati-local.firebaseapp.com",
    VITE_FIREBASE_PROJECT_ID: "pragati-local",
    VITE_FIREBASE_STORAGE_BUCKET: "pragati-local.appspot.com",
    VITE_FIREBASE_MESSAGING_SENDER_ID: "pragati-local",
    VITE_FIREBASE_APP_ID: "pragati-local",
    VITE_FIREBASE_AUTH_EMULATOR_HOST: "127.0.0.1:59099",
  };

  let envText = existsSync(frontendEnv) ? readFileSync(frontendEnv, "utf8") : "";
  let changed = false;

  for (const [key, value] of Object.entries(requiredValues)) {
    const pattern = new RegExp(`^${key}=.*$`, "m");
    const replacement = `${key}=${value}`;

    if (pattern.test(envText)) {
      const next = envText.replace(pattern, replacement);
      if (next !== envText) changed = true;
      envText = next;
    } else {
      envText = `${envText.trimEnd()}${envText.trim() ? "\n" : ""}${replacement}\n`;
      changed = true;
    }
  }

  if (changed) {
    writeFileSync(frontendEnv, envText);
    console.log("✓ Configured frontend for the local Firebase Auth emulator.");
  } else {
    console.log("✓ frontend/.env.local already uses the local Firebase configuration.");
  }
};

const checkDedicatedPorts = async () => {
  const busy = [];

  for (const [name, port] of Object.entries(LOCAL_PORTS)) {
    if (await portIsBusy(port)) busy.push(`${name} (${port})`);
  }

  if (busy.length > 0) {
    throw new Error(
      `Required Pragati local port(s) are already in use: ${busy.join(", ")}. ` +
        "Close the application using the port and rerun npm run setup:dev. " +
        "Pragati deliberately uses dedicated high ports so native PostgreSQL/Redis installations on 5432/6379 can remain running."
    );
  }
};

const main = async () => {
  console.log("============================================");
  console.log(" Pragati - Local Intern Development Setup");
  console.log("============================================");

  if (Number(process.versions.node.split(".")[0]) < 18) {
    throw new Error("Node.js 18 or newer is required.");
  }

  if (!commandExists("docker")) {
    throw new Error("Docker was not found. Install Docker Desktop and rerun npm run setup:dev.");
  }

  if (!existsSync(path.join(root, "docker-compose.yml"))) {
    throw new Error("docker-compose.yml is missing. Run this command from the repository root.");
  }

  console.log("\nChecking Docker Compose...");
  run("docker", ["compose", "version"]);

  ensureBackendEnv();
  ensureFrontendEnv();
  await checkDedicatedPorts();

  console.log("\nValidating Docker Compose configuration...");
  run("docker", ["compose", "config", "-q"]);

  try {
    run("docker", ["compose", "up", "-d", "postgres", "redis", "firebase"]);
  } catch {
    throw new Error(
      "Docker could not start the Pragati local services. Check Docker Desktop and confirm the dedicated local ports are free."
    );
  }

  console.log("\nWaiting for PostgreSQL to become ready...");
  let postgresReady = false;
  for (let attempt = 1; attempt <= 30; attempt += 1) {
    try {
      run("docker", ["compose", "exec", "-T", "postgres", "pg_isready", "-U", "postgres", "-d", "pragati_dev"]);
      postgresReady = true;
      break;
    } catch {
      if (attempt < 30) await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  if (!postgresReady) {
    throw new Error("PostgreSQL did not become ready in time. Run `docker compose logs postgres` for details.");
  }

  console.log("\nWaiting for Firebase emulators to become reachable...");
  await waitForPort("Firebase UI", LOCAL_PORTS.firebaseUi);
  await waitForPort("Firestore emulator", LOCAL_PORTS.firestore);
  await waitForPort("Firebase Auth emulator", LOCAL_PORTS.firebaseAuth);

  console.log("\nWaiting for Redis to become reachable...");
  await waitForPort("Redis", LOCAL_PORTS.redis);

  run("npm", ["install"], backendDir);
  run("npm", ["install"], frontendDir);

  console.log("\nTesting the exact PostgreSQL connection used by the backend...");
  run("npm", ["run", "check:db"], backendDir);

  run("npm", ["run", "migrate"], backendDir);

  console.log("\n============================================");
  console.log(" Local environment is ready");
  console.log("============================================");
  console.log("Frontend:          http://localhost:5173");
  console.log("Backend:           http://localhost:5000");
  console.log("Firebase Emulator: http://localhost:54000");
  console.log("Auth Emulator:     http://localhost:59099");
  console.log("Firestore:         http://localhost:58080");
  console.log("PostgreSQL:        127.0.0.1:55432");
  console.log("Redis:             127.0.0.1:56379");
  console.log("\nRun `npm run dev` to start frontend and backend.");
  console.log("Register a local student through the app when student data is needed.");
};

try {
  await main();
} catch (error) {
  console.error(`\n✗ Local setup failed: ${error?.message || error}`);
  process.exitCode = 1;
}
