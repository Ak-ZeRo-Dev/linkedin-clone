import { connectDB } from "@/db/db";
import { IPost, Post } from "@/db/models/post";
import cloudinary from "@/lib/cloudinary";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const user = await currentUser();
    if (!user) return NextResponse.json("Unauthorized", { status: 401 });

    await connectDB();

    const post = await Post.findById(id);
    if (!post) return NextResponse.json("Post not found", { status: 404 });

    if (post.user.userId.toString() !== user.id) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const images: any[] = [];
    const existingImageIds = new Set(
      post.images?.map((img) => img._id?.toString()),
    );

    // Extract images from formData
    for (const entry of formData.entries()) {
      const [key, value] = entry;
      const match = key.match(/image-\[(\d+)\]/);

      if (match) {
        if (typeof value === "string") {
          images.push(JSON.parse(value));
        } else if (value instanceof File) {
          images.push({ file: value, order: Number(match[1]) });
        }
      }
    }

    // Identify images that were removed
    const removedImages =
      post.images?.filter(
        (img) => !images.some((newImg) => newImg._id === img._id?.toString()),
      ) || [];

    // Delete removed images from Cloudinary
    for (const image of removedImages) {
      if (image.public_id) {
        await cloudinary.uploader.destroy(image.public_id);
      }
    }

    // Process updated images
    const updatedImages: IPost["images"] = [];

    for (const image of images) {
      if (existingImageIds.has(image._id)) {
        updatedImages.push(image);
      } else if (image.file) {
        const result = await uploadToCloudinary(image.file as File);

        updatedImages.push({
          public_id: result.public_id,
          url: result.secure_url,
          order: image.order,
        });
      }
    }

    // Extract text and video
    const text = formData.get("text")?.toString().trim() || null;
    const video = formData.get("video")
      ? JSON.parse(formData.get("video") as string)
      : null;

    // Update post with new data
    const data = {
      text,
      video,
      images: updatedImages,
    };

    await post.updateOne(data);
    revalidatePath("/");

    return NextResponse.json("Post updated successfully", { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
