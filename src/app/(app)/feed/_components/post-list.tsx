"use client";

import type { FeedPost } from "@/lib/feed/feed.types";
import { PostListItem } from "./post-list-item";

type PostListProps = {
  posts: FeedPost[];
};

export function PostList({ posts }: PostListProps) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostListItem key={post.id} post={post} />
      ))}
    </div>
  );
}
