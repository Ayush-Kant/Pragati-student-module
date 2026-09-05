import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";

const children = [];
const root = process.cwd();
const comSpec = process.env.ComSpec || "cmd.exe";

const start = (label, args, cwd) => {
  const child = process.platform === "win32"
    ? spawn(comSpec, ["/d", "/s", "/c", `npm ${args.join(" ")}`], {
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

start("Backend", ["run", "dev"], path.join(root, "backend"));
start("Frontend", ["run", "dev"], path.join(root, "frontend"));

const shutdown = () => {
  for (const child of children) {
    if (!child.killed) child.kill("SIGTERM");
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("exit", shutdown);
