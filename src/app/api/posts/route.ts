import { connectDB } from "@/db/db";
import { Post } from "@/db/models/post";
import { PreviewItem } from "@/types/post";
import { uploadWithRetry } from "@/utils/uploadToCloudinary";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("User not found");
    }

    const formData = await req.formData();
    const text = formData.get("text") || null;
    const video = formData.get("video")
      ? JSON.parse(formData.get("video") as string)
      : null;

    const images: Pick<PreviewItem, "file" | "order">[] = [];
    for (const entry of formData.entries()) {
      const [key, file] = entry;
      const match = key.match(/image-\[(\d+)\]/);

      if (match && file instanceof File) {
        images.push({ file, order: Number(match[1]) });
      }
    }

    const uploadedImages: any[] = [];
    if (images.length > 0) {
      for (const image of images) {
        const result = await uploadWithRetry(image.file as File);
        uploadedImages.push({
          public_id: result.public_id,
          url: result.secure_url,
          order: image.order,
        });
      }
    }

    // Construct post data
    const postData = {
      user: {
        userId: user.id,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        imageUrl: user.imageUrl,
      },
      ...(text && { text }),
      ...(video && { video }),
      ...(uploadedImages.length > 0 && { images: uploadedImages }),
    };

    await connectDB();
    await Post.create(postData);

    revalidatePath("/");

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Something went wrong" },
      { status: 500 },
    );
  }
}
