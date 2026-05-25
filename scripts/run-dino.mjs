import { spawn } from "node:child_process";

const mode = process.argv[2] ?? "dev";
const pnpm = "pnpm";

const commandsByMode = {
  dev: [[pnpm, ["--filter", "@workspace/dino-math-quest", "run", "dev"]]],
  preview: [[pnpm, ["--filter", "@workspace/dino-math-quest", "run", "serve"]]],
  build: [
    [pnpm, ["run", "typecheck"]],
    [pnpm, ["-r", "--if-present", "run", "build"]],
  ],
};

const commands = commandsByMode[mode];

if (!commands) {
  console.error(`Unknown Dino Quest run mode: ${mode}`);
  process.exit(1);
}

const env = {
  ...process.env,
  PORT: process.env.PORT || "25918",
  BASE_PATH: process.env.BASE_PATH || "/",
};

let activeChild;

const runCommand = ([command, args]) =>
  new Promise((resolve, reject) => {
    const [spawnCommand, spawnArgs] =
      process.platform === "win32"
        ? [process.env.ComSpec || "cmd.exe", ["/d", "/s", "/c", [command, ...args].join(" ")]]
        : [command, args];

    activeChild = spawn(spawnCommand, spawnArgs, {
      env,
      stdio: "inherit",
    });

    activeChild.on("exit", (code, signal) => {
      activeChild = undefined;

      if (signal) {
        reject(new Error(`Command stopped by ${signal}: ${command} ${args.join(" ")}`));
        return;
      }

      if (code !== 0) {
        reject(new Error(`Command failed with exit code ${code}: ${command} ${args.join(" ")}`));
        return;
      }

      resolve();
    });
  });

const forwardSignal = (signal) => {
  if (activeChild && !activeChild.killed) {
    activeChild.kill(signal);
  }
};

process.on("SIGINT", () => forwardSignal("SIGINT"));
process.on("SIGTERM", () => forwardSignal("SIGTERM"));

(async () => {
  try {
    for (const command of commands) {
      await runCommand(command);
    }
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
})();
