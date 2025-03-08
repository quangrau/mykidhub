import { Metadata } from "next";

import { FeedService } from "@/lib/feed/feed.service";
import { CreatePostForm } from "./_components/create-post-form";
import { PostList } from "./_components/post-list";

export const metadata: Metadata = {
  title: "Feed - MyKidHub",
  description: "View and manage your organization's feed",
};

export default async function FeedPage() {
  const posts = await FeedService.getPosts();

  return (
    <div className="grid grid-cols-2">
      <div>
        <CreatePostForm />

        <div className="mt-8">
          <PostList posts={posts} />
        </div>
      </div>
    </div>
  );
}
