"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { FeedPost } from "@/lib/feed/feed.types";
import { formatDate } from "@/lib/utils/datetime";
import { MoreHorizontal } from "lucide-react";
import { PostTypeAvatar } from "./post-type-avatar";

type PostListItemProps = {
  post: FeedPost;
};

export function PostListItem({ post }: PostListItemProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <PostTypeAvatar type={post.type} />
            <div className="space-y-1">
              <h3 className="font-semibold">{post.title}</h3>
              <p className="text-sm text-muted-foreground">
                Posted by {post.author.user.name} •{" "}
                {formatDate(post.publishedAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>{post.content}</CardContent>
      {/* <CardFooter>
        <div className="flex items-center space-x-4">
          <span>0 comments</span>
          <span>0 reads</span>
        </div>
      </CardFooter> */}
    </Card>
  );
}
