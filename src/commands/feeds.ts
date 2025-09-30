import { getUserFromId } from "src/lib/db/queries/users.js";
import { createFeed, createFeedFollow, getFeeds } from "src/lib/db/queries/feeds.js";
import type { User, Feed } from "src/lib/db/schema.js";

export async function handlerFeeds() {
    const feeds = await getFeeds();

    if (feeds.length === 0) {
        console.log("No feeds found");
        return;
    }

    for (const feed of feeds) {
        const user = await getUserFromId(feed.userId);
        if (!user) {
            throw new Error("Failed to find user for feed")
        }
        printFeed(feed, user);
        console.log()
    }
}

export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 2) {
        throw new Error("usage: addfeed <feed name> <url>")
    }

    const feedName = args[0];
    const url = args[1];

    const feed = await createFeed(feedName, url, user.id);
    if (!feed) {
        throw new Error("failed to create feed")
    }

    await createFeedFollow(feed, user);

    printFeed(feed, user);
}

function printFeed(feed: Feed, user: User) {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
}