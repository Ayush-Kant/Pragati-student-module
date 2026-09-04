import { spawn } from "node:child_process";
import process from "node:process";

const children = [];
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

const start = (label, args, cwd) => {
  const child = spawn(npmCommand, args, {
    cwd,
    stdio: "inherit",
    shell: false,
    env: process.env,
  });

  children.push(child);
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

start("Backend", ["run", "dev"], `${root}/backend`);
start("Frontend", ["run", "dev"], `${root}/frontend`);

const shutdown = () => {
  for (const child of children) {
    if (!child.killed) child.kill("SIGTERM");
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("exit", shutdown);
