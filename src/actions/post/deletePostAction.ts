"use server";

import { connectDB } from "@/db/db";
import { Post } from "@/db/models/post";
import cloudinary from "@/lib/cloudinary";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const deletePostAction = async (postId: string) => {
  await auth.protect();

  try {
    await connectDB();

    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    if (post.images && post.images.length > 0) {
      post.images.forEach(async (image) => {
        await cloudinary.uploader.destroy(image.public_id);
      });
    }

    await post.removePost();

    revalidatePath("/");

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Something went wrong",
    };
  }
};
