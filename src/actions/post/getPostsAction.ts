"use server";

import { POSTS_LIMIT } from "@/constants/constants";
import { connectDB } from "@/db/db";
import { Post } from "@/db/models/post";

export const getPostsAction = async (page = 1) => {
  const limit = POSTS_LIMIT;
  const skip = (page - 1) * limit;
  try {
    await connectDB();
    const posts = await Post.getAllPosts(limit, skip);

    if (!posts) {
      throw new Error("Posts not found");
    }

    return {
      success: true,
      posts,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Something went wrong",
    };
  }
};
