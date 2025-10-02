import { getFeedById } from "src/lib/db/queries/feeds.js";
import { getPostsForUser } from "src/lib/db/queries/posts.js";
import type { User, Post } from "src/lib/db/schema.js";

export async function handlerBrowse(cmdName: string, user: User, ...args: string[]) {
    if (args.length > 1) {
        throw new Error("usage: browse <post limit (optional)>")
    }

    let limit = 2
    if (args[0]) {
        limit = Number(args[0]);
    }
    if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
        throw new Error("Invalid limit (use a whole number 1-50). Usage: browse <post limit (optional)>")
    }

    const posts: Post[] = await getPostsForUser(user.id, limit);
    if (posts.length === 0) {
        console.log(`No posts found for user ${user.name}`);
        return;
    }

    let n = 1
    for (const post of posts) {
        printPost(post, n, posts.length);
        n++;
    }
}

function printPost(post: Post, n: number, l: number) {
    const date = post.publishedAt ?? "unknown";
    console.log(`================{ ${n}/${l} }================`);
    if (post.title) {
        console.log(post.title);
    }
    console.log();
    console.log(`Date: ${date}`);
    console.log(`URL: ${post.url}`)
    console.log()
    if (post.description) {
        console.log(post.description);
        console.log();
    }
}