"use server";

import { connectDB } from "@/db/db";
import { IPostBase, Post } from "@/db/models/post";
import { postSchema } from "@/schema/posts";
import { IPost } from "@/types/types";
import { IUser } from "@/types/user";
import { auth, currentUser } from "@clerk/nextjs/server";
import cloudinary from "@/lib/cloudinary";

export const createPostAction = async (
  data: IPost,
): Promise<{ success: boolean; error?: string }> => {
  await auth.protect();
  const user = await currentUser();

  if (!user) {
    return { success: false, error: "User not found" };
  }

  const validData = postSchema.safeParse(data);
  if (!validData.success) {
    return { success: false, error: validData.error.errors[0].message };
  }

  const userDB: IUser = {
    id: user.id,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    imageUrl: user.imageUrl,
  };

  const { text, items } = validData.data;

  try {
    await connectDB();

    const images = items?.filter((item) => item.type === "image") || [];
    let uploadedImages: {
      type: "image" | "video";
      public_id: string;
      url: string;
      order: number | undefined;
    }[] = [];

    if (images && images.length) {
      uploadedImages = await Promise.all(
        images.map(async (image) => {
          if (!image.file)
            return {
              type: image.type,
              public_id: "",
              url: "",
              order: image.order,
            };

          const arrayBuffer = await image.file.arrayBuffer();
          const buffer = new Uint8Array(arrayBuffer);

          const result: any = await new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                {
                  resource_type: "image",
                  folder: "posts",
                  tags: ["post"],
                },
                (err, result) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(result);
                  }
                },
              )
              .end(buffer);
          });

          return {
            type: image.type,
            public_id: result.public_id,
            url: result.secure_url,
            order: image.order,
          };
        }),
      );
    }

    const video = items?.find((item) => item.type === "video");

    const postData = {
      user: userDB,
      ...(text && { text }),
      ...(video && {
        type: video.type,
        url: video.url,
        order: video.order,
      }),
      ...(images && { items: uploadedImages }),
    };

    await Post.create(postData);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Something went wrong" };
  }
};
