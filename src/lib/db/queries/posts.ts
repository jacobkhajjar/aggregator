import { date } from "drizzle-orm/mysql-core";
import { db } from "../index.js";
import { feeds, posts, type Post } from "../schema.js";
import { eq, inArray, desc } from "drizzle-orm";
import type { RSSItem } from "src/lib/rss.js";
import { getFeedFollowsForUser } from "./feeds.js";
import { fromCamel } from "postgres";

export async function createPost(post: RSSItem, feedId: string) {
    await db.insert(posts).values({
            title: post.title,
            url: post.link,
            description: post.description,
            publishedAt: post.pubDate ? new Date(post.pubDate) : null,
            feedId: feedId
        })
}

export async function getPostsForUser(userId: string, limit: number): Promise<Post[]> {
    const userFeedFollows = await getFeedFollowsForUser(userId);
    const userFeedIds: string[] = [];

    for (const feed of userFeedFollows) {
        if (feed.feeds) {
            userFeedIds.push(feed.feeds.id)
        }
    }

    if (userFeedFollows.length === 0) {
        return [];
    }

    const userPosts = await db.select()
    .from(posts)
    .where(inArray(posts.feedId, userFeedIds))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);

    return userPosts;
}