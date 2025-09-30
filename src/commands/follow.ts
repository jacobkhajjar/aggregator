import { createFeedFollow, getFeedByUrl, getFeedFollowsForUser, unfollow } from "src/lib/db/queries/feeds.js";
import { feedFollows, type User } from "src/lib/db/schema.js";

export async function handlerFollow(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error("usage: follow <url>")
    }

    const url = args[0];

    const feed = await getFeedByUrl(url);
    
    if (!feed) {
        throw new Error("Feed not found");
    }

    try { await createFeedFollow(feed, user); }
    catch { throw new Error("Already following feed"); }

    console.log(`User ${user.name} is now following feed ${feed.name}`);
}

export async function handlerFollowing(cmdName: string, user: User) {

    const feeds = await getFeedFollowsForUser(user);

    if (!feeds || feeds.length === 0) {
        console.log("No feeds found for user");
        return;
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

export async function handlerUnfollow(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error("Usage: unfollow <feed url>");
    }

    const url = args[0];
    const feed = await getFeedByUrl(url);

    if (!feed) {
        throw new Error("Error unfollowing feed: feed not found");
    }

    const deleted = await unfollow(feed.id, user.id);

    if (!deleted || deleted === 0) {
        console.log("Error unfollowing feed: user not following table");
        return;
    }

    console.log(`Unfollowed ${deleted} feeds ${feed.name}`);
}