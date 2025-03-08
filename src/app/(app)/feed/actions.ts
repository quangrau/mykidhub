"use server";

import { PostPriorityLevel, PostType } from "@prisma/client";
import { z } from "zod";

import { FeedService } from "@/lib/feed/feed.service";
import { revalidatePath } from "next/cache";

const createPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  type: z.nativeEnum(PostType),
  priority: z.nativeEnum(PostPriorityLevel),
  audiences: z.array(z.string()).optional(),
});

export async function createPostAction(
  values: z.infer<typeof createPostSchema>
) {
  const validatedData = await createPostSchema.safeParse(values);
  if (!validatedData.success) {
    return {
      success: false,
      message: "Invalid form data.",
    };
  }

  try {
    const data = validatedData.data;
    await FeedService.createPost(data);

    revalidatePath("/feed");
    return {
      success: true,
      message: "Post created successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong.",
    };
  }
}
