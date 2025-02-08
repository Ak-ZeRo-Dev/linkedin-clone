"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IPostDocument } from "@/db/models/post";
import { IEditMedia, useEditStore } from "@/store/postStore";
import { Edit } from "lucide-react";
import { useEffect, useRef, useTransition } from "react";
import { toast } from "sonner";
import PostImages from "../PostImages";
import PostText from "../PostText";
import PostVideo from "../PostVideo";
import EditMedia from "./EditMedia";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const EditPost = ({ post }: { post: IPostDocument }) => {
  const { text, images, video } = post;
  const router = useRouter();

  const { data, setData } = useEditStore();
  const closeRef = useRef<any>(null);

  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const toastId = toast.loading("Editing post...");
      let updatedImages: any[] = [];
      let video = null;

      if (data.items?.length) {
        updatedImages = data.items
          ?.filter((item) => item.type === "image")
          .map((item) => {
            return {
              ...item,
              ...(item.file && { file: item.file }),
              order: item.order,
            };
          });

        video = data.items?.find((item) => item.type === "video");
      }

      const form = new FormData();

      if (data.text) {
        form.append("text", data.text);
      }
      if (video) {
        form.append(
          "video",
          JSON.stringify({
            url: video.url,
            order: video.order,
          }),
        );
      }

      if (updatedImages?.length) {
        const imagesSet = new Set(images?.map((image) => image._id));

        updatedImages.forEach((image) => {
          const updatedData = imagesSet.has(image._id)
            ? JSON.stringify(image)
            : (image.file as File);
          form.append(`image-[${image.order}]`, updatedData);
        });

        updatedImages.sort((a, b) => a.order - b.order);
      }

      try {
        const res = await fetch(`/api/posts/${post._id}`, {
          method: "PATCH",
          body: form,
        });

        await res.json();
        router.refresh();
        closeRef.current?.click();
        toast.success("Post edited successfully!", { id: toastId });
      } catch (error) {
        toast.error("Something went wrong", { id: toastId });
      }
    });
  };

  useEffect(() => {
    const editImages: IEditMedia[] = images?.length
      ? images.map((image) => ({ ...image, type: "image" }))
      : [];

    const editVideo: IEditMedia[] = video ? [{ ...video, type: "video" }] : [];

    setData({
      ...(text && { text }),
      items: [...editImages, ...editVideo].sort((a, b) => a.order - b.order),
    });
  }, [images, setData, text, video]);

  return (
    <Dialog>
      <DialogTrigger className="w-full" asChild>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
        </DialogHeader>
        <div>
          <form action={handleSubmit}>
            <div className={cn(isPending && "pointer-events-none opacity-80")}>
              <PostText type="edit" />
              <PostImages type="edit" />
              <PostVideo type="edit" />
              {data.items?.length ? <EditMedia /> : null}
            </div>

            <Button
              type="submit"
              size="sm"
              className="mt-5 w-full"
              disabled={isPending}
            >
              {isPending ? "Editing..." : "Edit Post"}
            </Button>
          </form>
        </div>
        <DialogClose ref={closeRef} />
      </DialogContent>
    </Dialog>
  );
};
export default EditPost;
