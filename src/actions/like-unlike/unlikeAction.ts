"use server";

import { connectDB } from "@/db/db";
import { Post } from "@/db/models/post";
import { auth } from "@clerk/nextjs/server";

export const unlikeAction = async (postId: string, userId: string) => {
  await auth.protect();

  try {
    await connectDB();

    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    await post.unlike(userId);

    return {
      success: true,
      error: null,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Something went wrong",
    };
  }
};
