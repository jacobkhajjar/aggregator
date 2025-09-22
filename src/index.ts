import { readConfig } from "./config.js";
import { handlerLogin, runCommand, type CommandsRegistry } from "./commands.js"

function main() {
  const cfg = readConfig();
  
  const registry: CommandsRegistry = {
    "login": handlerLogin
  }

  const input = process.argv.slice(2);
  if (!input) {
    throw new Error("not enough arguments were provided")
  }

  const cmdName = input[0];
  const args = input.slice(1);

  runCommand(registry, cmdName, ...args);

}

main();