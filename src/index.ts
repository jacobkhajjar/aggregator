import { readConfig } from "./config.js";
import { runCommand, registerCommand, type CommandsRegistry } from "./commands/commands.js"
import { handlerLogin, handlerRegister, handlerReset, handlerUsers } from "./commands/users.js";
import { handlerAgg } from "./commands/aggregate.js";
import { handlerAddFeed, handlerFeeds } from "./commands/feeds.js";
import { handlerFollow, handlerFollowing } from "./commands/follow.js";

async function main() {


  try {

    const cfg = readConfig();
  
    const registry: CommandsRegistry = {
      "login": handlerLogin
    }

    registerCommand(registry, "addfeed", handlerAddFeed)
    registerCommand(registry, "feeds", handlerFeeds);
    registerCommand(registry, "follow", handlerFollow);
    registerCommand(registry, "following", handlerFollowing)
    registerCommand(registry, "agg", handlerAgg);
    registerCommand(registry, "login", handlerLogin);
    registerCommand(registry, "register", handlerRegister);
    registerCommand(registry, "users", handlerUsers);
    registerCommand(registry, "reset", handlerReset);

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