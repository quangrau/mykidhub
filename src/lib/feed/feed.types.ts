import { Prisma } from "@prisma/client";

export const feedPostsQuery = {
  include: {
    author: {
      include: {
        user: true,
      },
    },
    // audiences: true,
    // comments: {
    //   include: {
    //     author: {
    //       include: {
    //         user: true,
    //       },
    //     },
    //   },
    // },
    // readReceipts: true,
  },
};

export type FeedPost = Prisma.PostGetPayload<typeof feedPostsQuery>;
