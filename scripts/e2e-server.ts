import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO_URL = "http://localhost:3000";
const WAIT_TIMEOUT_MS = 120_000;
const POLL_MS = 500;

async function waitForUrl(url: string, timeoutMs: number): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (res.ok) return;
    } catch {
      // not ready yet
    }
    await new Promise((r) => setTimeout(r, POLL_MS));
  }
  throw new Error(`Server at ${url} did not become ready within ${timeoutMs}ms`);
}

export default async function setup(): Promise<() => void> {
  let devProcess: ReturnType<typeof spawn> | null = null;

  await new Promise<void>((resolve, reject) => {
    const tsc = spawn("pnpm", ["run", "tsc"], {
      cwd: rootDir,
      stdio: "inherit",
      shell: true,
    });
    tsc.on("error", reject);
    tsc.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`pnpm tsc exited with ${code}`));
        return;
      }
      devProcess = spawn("pnpm", ["run", "dev"], {
        cwd: rootDir,
        stdio: "pipe",
        shell: true,
      });
      devProcess.on("error", reject);
      devProcess.on("exit", (c) => {
        if (c !== 0 && c !== null && devProcess !== null) {
          reject(new Error(`pnpm dev exited with ${c}`));
        }
      });
      resolve();
    });
  });

  await waitForUrl(DEMO_URL, WAIT_TIMEOUT_MS);

  return function teardown() {
    if (devProcess?.pid) {
      devProcess.kill("SIGTERM");
      devProcess = null;
    }
  };
}
