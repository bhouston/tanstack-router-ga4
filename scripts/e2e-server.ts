import { spawn } from 'node:child_process';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer, type ViteDevServer } from 'vite';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const exampleWebsiteDir = path.join(rootDir, 'packages', 'example-website');
const exampleWebsiteViteConfig = path.join(exampleWebsiteDir, 'vite.config.ts');
const librarySourceEntry = path.join(rootDir, 'packages', 'tanstack-router-ga4', 'src', 'index.ts');
const DEMO_URL = 'http://localhost:3000';
const DEMO_PORT = 3000;
const WAIT_TIMEOUT_MS = 120_000;
const POLL_MS = 500;

function checkPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.once('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        resolve(false);
        return;
      }
      reject(error);
    });

    server.once('listening', () => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(true);
      });
    });

    server.listen({
      port,
      host: '::',
      ipv6Only: false,
    });
  });
}

async function getPortOccupantDetails(port: number): Promise<string | null> {
  return new Promise((resolve) => {
    const lsof = spawn('lsof', ['-nP', `-iTCP:${port}`, '-sTCP:LISTEN'], {
      cwd: rootDir,
      stdio: ['ignore', 'pipe', 'ignore'],
    });

    let stdout = '';

    lsof.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    lsof.on('error', () => resolve(null));
    lsof.on('exit', (code) => {
      if (code !== 0) {
        resolve(null);
        return;
      }

      const details = stdout
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(1)
        .join('\n');

      resolve(details || null);
    });
  });
}

async function waitForUrl(url: string, timeoutMs: number): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (res.ok) return;
    } catch {
      // not ready yet
    }
    await new Promise((r) => setTimeout(r, POLL_MS));
  }
  throw new Error(`Server at ${url} did not become ready within ${timeoutMs}ms`);
}

async function createDemoServer(): Promise<ViteDevServer> {
  return createServer({
    appType: 'spa',
    configFile: exampleWebsiteViteConfig,
    resolve: {
      alias: {
        'tanstack-router-ga4': librarySourceEntry,
      },
    },
    root: exampleWebsiteDir,
    server: {
      host: '127.0.0.1',
      port: DEMO_PORT,
      strictPort: true,
    },
  });
}

export default async function setup(): Promise<() => void> {
  let viteServer: ViteDevServer | null = null;

  const occupantDetails = await getPortOccupantDetails(DEMO_PORT);
  if (occupantDetails) {
    const detailsSuffix = occupantDetails ? `\nCurrent listener(s):\n${occupantDetails}` : '';

    throw new Error(
      `E2E demo server requires port ${DEMO_PORT}, but it is already in use. ` +
        `Stop the process using that port and rerun the tests.${detailsSuffix}`,
    );
  }

  const portAvailable = await checkPortAvailable(DEMO_PORT);
  if (!portAvailable) {
    throw new Error(
      `E2E demo server requires port ${DEMO_PORT}, but it could not be reserved for startup. ` +
        'Stop the process using that port and rerun the tests.',
    );
  }

  viteServer = await createDemoServer();
  await viteServer.listen();

  await waitForUrl(DEMO_URL, WAIT_TIMEOUT_MS);

  return async function teardown() {
    if (viteServer) {
      await viteServer.close();
      viteServer = null;
    }
  };
}
