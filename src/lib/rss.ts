import { XMLParser } from "fast-xml-parser";

export type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

export type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
    const response = await fetch(feedURL, {
        headers: {
            "User-Agent": "gator",
            accept: "application/rss+xml",
        }
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.text();

    const parser = new XMLParser();
    const feed = parser.parse(result);

    
    const channel = feed.rss?.channel
    if (!channel) {
        throw new Error("RSSFeed object missing channel field");
    }

    if (
    !channel ||
    !channel.title ||
    !channel.link ||
    !channel.description ||
    !channel.item
  ) {
    throw new Error("failed to parse channel");
  }

    const items: any[] = Array.isArray(channel.item)
    ? channel.item
    : [channel.item];
    
    const feedItems: RSSItem[] = []
    
    for (const item of items) {
        if (!item.title || !item.link || !item.description || !item.pubDate) {
            continue;
        }

        feedItems.push({
            title: item.title,
            link: item.link,
            description: item.description,
            pubDate: item.pubDate
        })   
    }

    return {
        channel: {
            title: channel.title,
            link: channel.link,
            description: channel.description,
            item: feedItems
        }
    }
}