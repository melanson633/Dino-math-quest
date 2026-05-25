import { spawn, type ChildProcess } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const port = process.env.PORT || '25918';
const basePath = process.env.BASE_PATH || '/';
const playtestTag = new Date().toISOString().slice(0, 10);
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..', '..', '..');

function localIpv4Addresses() {
  return Object.values(os.networkInterfaces())
    .flatMap(adapter => adapter ?? [])
    .filter(address => address.family === 'IPv4' && !address.internal)
    .map(address => address.address);
}

function startDevServer(): ChildProcess {
  const command = process.platform === 'win32' ? process.env.ComSpec || 'cmd.exe' : 'pnpm';
  const args = process.platform === 'win32'
    ? ['/d', '/s', '/c', 'pnpm --filter @workspace/dino-math-quest run dev']
    : ['--filter', '@workspace/dino-math-quest', 'run', 'dev'];

  return spawn(command, args, {
    cwd: repoRoot,
    env: { ...process.env, PORT: port, BASE_PATH: basePath },
    stdio: 'inherit',
  });
}

function printInstructions() {
  const localhostUrl = `http://127.0.0.1:${port}/?playtest=ipad-${playtestTag}`;
  const lanUrls = localIpv4Addresses().map(address => `http://${address}:${port}/?playtest=ipad-${playtestTag}`);

  console.log('');
  console.log('Dino Quest iPad playtest server');
  console.log('');
  console.log('1. Keep this terminal open.');
  console.log('2. Put the iPad on the same Wi-Fi network as this computer.');
  console.log('3. Open one of these URLs in iPad Safari:');
  console.log('');
  for (const url of lanUrls.length > 0 ? lanUrls : [localhostUrl]) {
    console.log(`   ${url}`);
  }
  console.log('');
  console.log('4. Run the real-device checklist in docs/qa-playtest-checklist.md.');
  console.log('5. Press Ctrl+C here when finished.');
  console.log('');

  if (lanUrls.length === 0) {
    console.log('No non-internal IPv4 address was detected. If the iPad cannot reach localhost, check Wi-Fi/VPN/firewall state and rerun.');
    console.log('');
  }
}

if (process.argv.includes('--print-only')) {
  printInstructions();
  process.exit(0);
}

const child = startDevServer();
printInstructions();

function stop(signal: NodeJS.Signals) {
  if (child.pid && !child.killed) {
    child.kill(signal);
  }
}

process.on('SIGINT', () => stop('SIGINT'));
process.on('SIGTERM', () => stop('SIGTERM'));

child.on('exit', (code, signal) => {
  if (signal) {
    process.exit(0);
  }
  process.exit(code ?? 0);
});
