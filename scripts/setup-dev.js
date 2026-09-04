import { existsSync, copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const backendDir = path.join(root, "backend");
const frontendDir = path.join(root, "frontend");
const backendEnv = path.join(backendDir, ".env");
const backendEnvTemplate = path.join(backendDir, ".env.intern.example");

const run = (command, args, cwd = root) => {
  console.log(`\n> ${command} ${args.join(" ")}`);
  execFileSync(command, args, { cwd, stdio: "inherit", shell: process.platform === "win32" });
};

const commandExists = (command) => {
  try {
    run(process.platform === "win32" ? "where" : "which", [command]);
    return true;
  } catch {
    return false;
  }
};

const ensureFile = (target, template) => {
  if (existsSync(target)) {
    console.log(`✓ Keeping existing ${path.relative(root, target)}`);
    return;
  }
  copyFileSync(template, target);
  console.log(`✓ Created ${path.relative(root, target)}`);
};

const main = () => {
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

  ensureFile(backendEnv, backendEnvTemplate);

  run("docker", ["compose", "up", "-d", "postgres", "redis", "firebase"]);

  console.log("\nWaiting for PostgreSQL to become ready...");
  for (let attempt = 1; attempt <= 30; attempt += 1) {
    try {
      run("docker", ["compose", "exec", "-T", "postgres", "pg_isready", "-U", "postgres", "-d", "pragati_dev"]);
      break;
    } catch {
      if (attempt === 30) throw new Error("PostgreSQL did not become ready in time.");
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1000);
    }
  }

  run("npm", ["install"], backendDir);
  run("npm", ["install"], frontendDir);
  run("npm", ["run", "migrate"], backendDir);

  console.log("\n============================================");
  console.log(" Local environment is ready");
  console.log("============================================");
  console.log("Frontend:          http://localhost:5173");
  console.log("Backend:           http://localhost:5000");
  console.log("Firebase Emulator: http://localhost:4000");
  console.log("Auth Emulator:     http://localhost:9099");
  console.log("Firestore:         http://localhost:8080");
  console.log("PostgreSQL:        localhost:5432");
  console.log("Redis:             localhost:6379");
  console.log("\nRun `npm run dev` to start frontend and backend.");
  console.log("Register a local student through the app when student data is needed.");
};

try {
  main();
} catch (error) {
  console.error(`\n✗ Local setup failed: ${error?.message || error}`);
  process.exitCode = 1;
}
