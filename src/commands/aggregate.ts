import { createPost } from "src/lib/db/queries/posts.js";
import { fetchFeed, type RSSFeed } from "../lib/rss.js"
import { getNextFeedToFetch, markFeedFetched } from "src/lib/db/queries/feeds.js";

export async function handlerAgg(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error("usage: agg <time_between_reqs>")
    }
    const durationStr = args[0].toLowerCase()
    const timeBetweenRequests = parseDuration(durationStr);
    console.log(`Collecting feeds every ${durationStr}`);

    scrapeFeeds().catch(handleError);
    const interval = setInterval(() => {
        scrapeFeeds().catch(handleError);
    }, timeBetweenRequests);

    await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
        console.log("Shutting down feed aggregator...");
        clearInterval(interval);
        resolve();
  });
});
}

async function scrapeFeeds() {
    const feed = await getNextFeedToFetch();
    if (!feed) {
        return;
    }
    console.log(`Scraping feed: ${feed.name}`)
    const feedContent = await fetchFeed(feed.url);
    if (!feedContent) {
        console.log(`error fetching content for feed ${feed.name}`);
        return;
    }
    for (const item of feedContent.channel.item) {
        try {
            await createPost(item, feed.id);
            console.log("Post created")
        } catch {
            continue;
        }
    }
    await markFeedFetched(feed.id);
    console.log("Scrape complete")
    console.log()
}

function printFeedContent(feedContent: RSSFeed) {
    for (const item of feedContent.channel.item) {
        console.log(item.title);
    }
}

function parseDuration(durationStr: string): number {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);
    if (!match) {
        throw new Error("improper number format, use a number followed by ms|s|m|h")
    }
    let duration: number = +match[1];
    switch(match[2]) {
        case "ms":
            duration *= 1;
            break;
        case "s":
            duration *= 1000;
            break;
        case "m":
            duration *= (60 * 1000);
            break;
        case "h":
            duration *= (60 * 60 * 1000)
            break;
    }
    return duration;
}

function handleError(err: unknown) {
  if (err instanceof Error) {
    console.error("[agg] error:", err.message);
    if (err.stack) console.error(err.stack);
  } else {
    console.error("[agg] unknown error:", err);
  }
}