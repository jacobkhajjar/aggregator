import { readConfig } from "src/config.js";
import { getUser } from "src/lib/db/queries/users.js";
import { createFeedFollow, getFeedByUrl, getFeedFollowsForUser } from "src/lib/db/queries/feeds.js";
import type { User, Feed } from "src/lib/db/schema.js";

export async function handlerFollow(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error("usage: follow <url>")
    }

    const userName = readConfig().currentUserName;
    const user = await getUser(userName);

    const url = args[0];

    const feed = await getFeedByUrl(url);
    
    if (!feed) {
        throw new Error("Feed not found");
    }

    try { await createFeedFollow(feed, user); }
    catch { throw new Error("Already following feed"); }

    console.log(`User ${user.name} is now following feed ${feed.name}`);
}

export async function handlerFollowing() {
   
    const userName = readConfig().currentUserName;
    const user = await getUser(userName);

    const feeds = await getFeedFollowsForUser(user);

    if (!feeds || feeds.length === 0) {
        throw new Error("No feeds found for user");
    }

    console.log(`Found ${feeds.length} feeds for user ${user.name}`)
    let i = 1
    for (const feed of feeds) {
        if (!feed.feeds) {
            continue;
        }
        console.log(`${i}. ${feed.feeds.name}`);
        i++;
    }
}