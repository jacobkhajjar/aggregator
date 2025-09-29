import { setUser } from "../config.js";
import { createUser, getUser, getUsers, deleteAllUsers } from "../lib/db/queries/users.js";
import { readConfig } from "../config.js";

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

export async function handlerUsers() {
    const cfg = readConfig();
    const users = await getUsers();
    for (const user of users) {
        if (cfg.currentUserName === user.name) {
            console.log(`* ${user.name} (current)`);
        } else{
            console.log(`* ${user.name}`);
        }
    }
}

export async function handlerReset(cmdName: string, ...args: string[]) {
    await deleteAllUsers();
    console.log("All users deleted");
}