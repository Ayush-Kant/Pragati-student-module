import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";

const children = [];

const npmCli = process.platform === "win32"
  ? path.join(process.env.APPDATA || process.env.LOCALAPPDATA || "", "npm", "node_modules", "npm", "bin", "npm-cli.js")
  : "npm";

const start = (label, args, cwd) => {
  const child = process.platform === "win32"
    ? spawn(process.execPath, [npmCli, ...args], {
        cwd,
        stdio: "inherit",
        shell: false,
        env: process.env,
        windowsHide: false,
      })
    : spawn("npm", args, {
        cwd,
        stdio: "inherit",
        shell: false,
        env: process.env,
      });

  children.push(child);

  child.on("error", (error) => {
    console.error(`${label} failed to start: ${error.message}`);
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      console.log(`${label} stopped (${signal})`);
    } else if (code !== 0) {
      console.error(`${label} stopped with exit code ${code}`);
    }
  });

  return child;
};

const root = process.cwd();
const backendDir = path.join(root, "backend");
const frontendDir = path.join(root, "frontend");

start("Backend", ["run", "dev"], backendDir);
start("Frontend", ["run", "dev"], frontendDir);

const shutdown = () => {
  for (const child of children) {
    if (!child.killed) child.kill("SIGTERM");
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("exit", shutdown);
