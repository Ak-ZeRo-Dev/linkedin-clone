"use server";

import { COMMENTS_LIMIT } from "@/constants/constants";
import { connectDB } from "@/db/db";
import { Comment, IComment, ICommentBase } from "@/db/models/comment";
import { Post } from "@/db/models/post";

export const getCommentsAction = async (postId: string, page: number = 1) => {
  try {
    await connectDB();
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    const limit = COMMENTS_LIMIT;
    const skip = (page - 1) * limit;

    const comments: IComment[] = await Comment.find({ postId: postId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    if (!comments) {
      throw new Error("Comments not found");
    }

    return {
      success: true,
      comments: JSON.parse(JSON.stringify(comments)),
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Something went wrong",
    };
  }
};
