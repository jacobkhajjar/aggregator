import { readConfig } from "./config.js";
import { runCommand, registerCommand, type CommandsRegistry } from "./commands/commands.js"
import { handlerLogin, handlerRegister } from "./commands/users.js";

async function main() {


  try {

    const cfg = readConfig();
  
    const registry: CommandsRegistry = {
      "login": handlerLogin
    }

    registerCommand(registry, "login", handlerLogin);
    registerCommand(registry, "register", handlerRegister);

    const input = process.argv.slice(2);
    const cmdName = input[0];
    const args = input.slice(1);

    await runCommand(registry, cmdName, ...args);
    process.exit(0);

  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      console.log(error.stack);
      process.exit(1);
    }
  }
}

main();