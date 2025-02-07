"use server";

import { connectDB } from "@/db/db";
import { IComment, ICommentBase } from "@/db/models/comment";
import { Post } from "@/db/models/post";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const addCommentAction = async (
  form: FormData,
): Promise<{ success: boolean; error: string | null }> => {
  await auth.protect();
  const user = await currentUser();
  const postId = form.get("postId") as string;

  if (!user) {
    throw new Error("User not found");
  }

  try {
    await connectDB();
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    const comment: ICommentBase = {
      postId,
      user: {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        imageUrl: user.imageUrl,
        userId: user.id,
      },
      text: form.get("text") as string,
    };

    await post.addComment(comment);
    revalidatePath("/");

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
