import { db } from "@/lib/database/prisma.service";
import { getSession } from "@/lib/utils/session";
import { PostPriorityLevel, PostType } from "@prisma/client";
import { feedPostsQuery } from "./feed.types";

class FeedServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FeedServiceError";
  }
}

export type CreatePostData = {
  title: string;
  content: string;
  type: PostType;
  priority: PostPriorityLevel;
  isPinned?: boolean;
  audiences?: string[];
};

export const FeedService = {
  async createPost(data: CreatePostData) {
    const { title, content, type, priority } = data;
    try {
      const { session } = await getSession();
      const organizationId = session.activeOrganizationId;
      const memberId = session.memberId;

      // If audience is not provided, create post for all members in organization
      if (!data.audiences) {
        const members = await db.member.findMany({
          where: {
            organizationId,
          },
          select: {
            id: true,
          },
        });
        data.audiences = members.map((member) => member.id);
      }

      console.log(data.audiences);

      return await db.post.create({
        data: {
          title,
          content,
          type,
          priority,
          organizationId,
          authorId: memberId,
          audiences: {
            createMany: {
              data: data.audiences!.map((audienceId) => ({
                memberId: audienceId,
              })),
            },
          },
        },
        include: {
          author: {
            include: {
              user: true,
            },
          },
        },
      });
    } catch (error) {
      throw new FeedServiceError(
        `Failed to create post: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  async getPosts() {
    try {
      const { session } = await getSession();
      const organizationId = session.activeOrganizationId!;

      return await db.post.findMany({
        where: {
          organizationId,
          OR: [
            { publishedAt: { lte: new Date() } },
            { scheduledAt: { lte: new Date() } },
          ],
        },
        orderBy: [
          { isPinned: "desc" },
          { priority: "desc" },
          { publishedAt: "desc" },
        ],
        ...feedPostsQuery,
      });
    } catch (error) {
      throw new FeedServiceError(
        `Failed to fetch posts: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },
};
