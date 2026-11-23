import { spawn } from "node:child_process";
// One command for local development. Only stop children started by this script.
const children = [
  spawn(
    process.execPath,
    ["--watch", "--env-file=server/.env", "--import", "tsx", "server/index.ts"],
    { stdio: "inherit" },
  ),
  spawn(process.execPath, ["node_modules/expo/bin/cli", "start", "--web"], {
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
