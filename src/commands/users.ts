import { setUser } from "../config";
import { createUser, getUser } from "../lib/db/queries/users.js";

export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error("login handler needs username");
    }

    const user = args[0];

    const exists = await getUser(user);
    if (!exists) {
        throw new Error(`user ${user} does not exist. Use register command to create new user`);
    }

    setUser(user);
    console.log(`User set to ${user}`);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error("register handler needs username");
    }

    const user = args[0];
    const dupe = await getUser(user);
    if (dupe) {
        throw new Error(`username ${user} already in database`)
    }
    const userData = await createUser(user);
    setUser(user);
    
    console.log(`New user created and set to ${user}`);
    console.log(userData);
}