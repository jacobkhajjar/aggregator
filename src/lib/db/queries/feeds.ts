import { db } from "../index.js";
import { feedFollows, feeds } from "../schema.js";
import { eq, and, sql } from "drizzle-orm";
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

export async function getFeedById(feedId: string) {
    const [result] = await db.select().from(feeds).where(eq(feeds.id, feedId));
    return result;
}

export async function createFeedFollow(feed: Feed, user: User) {
    const [newFeedFollow] = await db.insert(feedFollows).values({ userId: user.id, feedId: feed.id }).returning();
    return newFeedFollow;
}

export async function getFeedFollowsForUser(userId: string) {
    const newFeedFollows = await db.select()
    .from(feedFollows)
    .where(eq(feedFollows.userId, userId))
    .leftJoin(feeds, eq(feedFollows.feedId, feeds.id));
    return newFeedFollows;
}

export async function unfollow(feedId: string, userId: string) {
    const deleted = await db.delete(feedFollows).where(and(eq(feedFollows.feedId, feedId), eq(feedFollows.userId, userId))).returning();
    return deleted.length;
}

export async function markFeedFetched(feedId: string) {
    await db.update(feeds).set({ lastFetchedAt: new Date(), updatedAt: new Date() } ).where(eq(feeds.id, feedId));
}

export async function getNextFeedToFetch() {
    const [result] = await db.select().from(feeds).orderBy(sql`${feeds.lastFetchedAt} asc nulls first`).limit(1);
    return result;
}