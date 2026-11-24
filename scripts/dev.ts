import { spawn } from "node:child_process";
import path from "node:path";

// One command for local development. Only stop children started by this script.
const expoCli = path.join("node_modules", "expo", "bin", "cli");
const backendEntry = path.join("backend", "src", "index.ts");

const children = [
  spawn(
    process.execPath,
    ["--watch", "--env-file=backend/.env", "--import", "tsx", backendEntry],
    { stdio: "inherit" },
  ),
  spawn(process.execPath, [expoCli, "start", "--web"], {
    stdio: "inherit",
  }),
];
let stopping = false;
function stop(code: number) {
  if (stopping) return;
  stopping = true;
  for (const child of children)
    if (child.exitCode === null) child.kill("SIGTERM");
  process.exitCode = code;
}
for (const child of children) {
  child.once("error", (e) => {
    console.error("Không khởi động được môi trường phát triển:", e.message);
    stop(1);
  });
  child.once("exit", (code, signal) => {
    if (!stopping) stop(code ?? (signal ? 1 : 0));
  });
}
process.once("SIGINT", () => stop(0));
process.once("SIGTERM", () => stop(0));
