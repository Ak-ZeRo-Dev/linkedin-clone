"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { postSchema } from "@/schema/posts";
import { usePreviewStore } from "@/store/previewStore";
import { IUser } from "@/types/user";
import { useUser } from "@clerk/nextjs";
import { XIcon } from "lucide-react";
import { useEffect, useRef, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "../../../ui/button";
import UserAvatar from "../../user/UserAvatar";
import PostText from "../PostText";
import Preview from "./Preview";
import UserActions from "./UserActions";
import { useRouter } from "next/navigation";

const ExitPreview = ({ resetPreview }: { resetPreview: () => void }) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        type="button"
        className="absolute right-1 top-1 h-5 w-5 rounded-full transition-colors hover:bg-destructive"
      >
        <XIcon className="w-4" />
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure you want to exit?</AlertDialogTitle>
        <AlertDialogDescription>
          Your changes will not be saved.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={resetPreview}>Confirm</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

const PostForm = () => {
  const { user } = useUser();
  const addPostRef = useRef<HTMLButtonElement | null>(null);
  const router = useRouter();

  const { preview, resetPreview, setPreview, setIsPending } = usePreviewStore();
  const isDisabled = !(preview.items.length || preview.text);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (form: FormData) => {
    const data = {
      text: preview.text ?? undefined,
      images: preview.items.reduce(
        (acc, item) =>
          item.type === "image"
            ? [...acc, { file: item.file as File, order: item.order }]
            : acc,
        [] as { file: File; order: number }[],
      ),
      video: preview.items.find((item) => item.type === "video"),
    };

    const validData = postSchema.safeParse(data);
    if (!validData.success) {
      toast.error(validData.error.errors[0].message);
      return;
    }

    startTransition(async () => {
      const toastId = toast.loading("Adding post...");
      try {
        const form = new FormData();
        if (data.text) form.append("text", data.text);
        if (data.video) form.append("video", JSON.stringify(data.video));
        data.images.forEach((image) =>
          form.append(`image-[${image.order}]`, image.file),
        );

        const res = await fetch("/api/posts", {
          method: "POST",
          body: form,
        });

        if (!res.ok) {
          throw new Error("Something went wrong");
        }

        resetPreview();
        router.refresh();
        toast.success("Post added successfully!", { id: toastId });
      } catch (error: any) {
        toast.error(error.message || "Something went wrong", { id: toastId });
      }
    });
  };

  useEffect(() => {
    setIsPending(isPending);
  }, [isPending]);

  return (
    <div>
      <form
        action={handleSubmit}
        className="rounded-lg bg-white px-4 py-2 dark:bg-gray-800"
      >
        <div className="relative flex items-center gap-2">
          <UserAvatar user={user as unknown as IUser} />
          <PostText
            trigger={
              <Button
                variant="ghost"
                className={cn(
                  "w-full cursor-pointer rounded-full border-2 bg-gray-100 py-3 pl-5 text-start text-sm font-semibold text-muted-foreground dark:bg-gray-900",
                  isPending &&
                    "pointer-events-none cursor-not-allowed opacity-50",
                )}
                onClick={() => setPreview({})}
                aria-label="What's on your mind?"
                role="button"
                disabled={isPending}
              >
                What's on your mind?
              </Button>
            }
            title="What's on your mind?"
          />
        </div>

        <UserActions />
        <Button
          type="submit"
          disabled={isPending || !preview}
          className="hidden"
          size="sm"
          ref={addPostRef}
        >
          Post
        </Button>
      </form>

      {(preview.text || preview.items.length > 0) && (
        <div className="relative mt-5 w-full rounded-md border p-2">
          <ExitPreview resetPreview={resetPreview} />

          <Preview />

          {!isDisabled && (
            <div className="my-2 flex justify-center">
              <Button
                type="submit"
                disabled={isPending || isDisabled}
                className="px-10"
                size="sm"
                onClick={() => addPostRef.current?.click()}
              >
                {isPending ? (
                  <span className="animate-pulse">Posting...</span>
                ) : (
                  "Post"
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostForm;
