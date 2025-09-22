import { setUser } from "./config.js";

type CommandHandler = (cmdName: string, ...args: string[]) => void;

export type CommandsRegistry = Record<string, CommandHandler>;

export function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error("login handler needs username");
    }

    const user = args[0]
    setUser(user);
    console.log(`User set to ${user}`)
}

function registerCommand(
    registry: CommandsRegistry,
    cmdName: string,
    handler: CommandHandler
) {
    registry[cmdName] = handler
}

export function runCommand(
    registry: CommandsRegistry,
    cmdName: string,
    ...args: string[]
) {
    const handler = registry[cmdName]
    if (!handler) {
        throw new Error(`Command ${cmdName} not in registry`);
    }
    handler(cmdName, ...args);
}