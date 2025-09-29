import { db } from "../index.js";
import { feedFollows, feeds } from "../schema.js";
import { eq } from "drizzle-orm";
import type { Feed, User } from "../schema.js";

export async function createFeed(name: string, url: string, user: string) {
    const [result] = await db.insert(feeds).values({ name: name, url: url, userId: user }).returning();
    return result;
}

export async function getFeeds() {
    const result = await db.select().from(feeds);
    return result;
}

export async function getFeedByUrl(url: string) {
    const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
    return result;
}

export async function createFeedFollow(feed: Feed, user: User) {
    const [newFeedFollow] = await db.insert(feedFollows).values({ userId: user.id, feedId: feed.id }).returning();
    return newFeedFollow;
}

export async function getFeedFollowsForUser(user: User) {
    const newFeedFollows = await db.select()
    .from(feedFollows)
    .where(eq(feedFollows.userId, user.id))
    .leftJoin(feeds, eq(feedFollows.feedId, feeds.id));
    return newFeedFollows;
}