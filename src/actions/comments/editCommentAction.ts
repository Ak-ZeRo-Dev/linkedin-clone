"use server";
import { connectDB } from "@/db/db";
import { Post } from "@/db/models/post";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const editCommentAction = async (
  postId: string,
  commentId: string,
  text: string,
) => {
  await auth.protect();
  try {
    const user = await currentUser();

    await connectDB();

    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    await post.updateComment(user?.id as string, commentId, text);

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
