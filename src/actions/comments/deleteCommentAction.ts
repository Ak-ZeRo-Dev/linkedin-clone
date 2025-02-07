"use server";

import { connectDB } from "@/db/db";
import { Post } from "@/db/models/post";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const deleteCommentAction = async (
  postId: string,
  commentId: string,
): Promise<{ success: boolean; error: string | null }> => {
  await auth.protect();

  const user = await currentUser();

  try {
    await connectDB();
    const post = await Post.findById(postId);
    if (!post) throw new Error("Post not found");

    await post.removeComment(commentId, user?.id as string);

    revalidatePath(`/`);

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
