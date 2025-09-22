import { setUser } from "src/config.js";

export function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error("login handler needs username");
    }

    const user = args[0]
    setUser(user);
    console.log(`User set to ${user}`)
}