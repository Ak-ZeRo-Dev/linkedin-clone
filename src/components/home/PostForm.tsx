"use client";

import { createPostAction } from "@/actions/postActions";
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
import { postSchema } from "@/schema/posts";
import { usePreviewStore } from "@/store/previewStore";
import { useUser } from "@clerk/nextjs";
import { XIcon } from "lucide-react";
import { useRef, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import UserAvatar from "../UserAvatar";
import AddImages from "./AddImages";
import AddText from "./AddText";
import AddVideo from "./AddVideo";
import Preview from "./Preview";
import RemoveText from "./RemoveText";

const ExitPreview = ({ resetPreview }: { resetPreview: () => void }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        asChild
        className="absolute right-1 top-1 cursor-pointer md:right-2"
      >
        <Button
          variant="ghost"
          size="icon"
          type="button"
          className="h-5 w-5 rounded-full"
        >
          <XIcon className="w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure to exit from the post?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Your changes will not be saved.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={resetPreview} variant="destructive" asChild>
            <AlertDialogAction>Confirm</AlertDialogAction>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const PostForm = () => {
  const { user } = useUser();
  const addPostRef = useRef<any>(null);

  const { preview, resetPreview, setPreview } = usePreviewStore();
  const isDisabled = !(preview.items.length || preview.text);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    const data = {
      text: preview.text ?? "",
      items: preview.items,
    };

    const validData = postSchema.safeParse(data);
    if (!validData.success) {
      toast.error(validData.error.errors[0].message);
      return;
    }

    startTransition(async () => {
      try {
        const { success } = await createPostAction(data);
        if (success) {
          resetPreview();
          toast.success("Post created successfully");
        } else {
          toast.error("Failed to create post");
        }
      } catch (error: any) {
        toast.error(error.message || "Something went wrong");
      }
    });
  };

  return (
    <div>
      <form
        // onSubmit={handleSubmit}
        action={handleSubmit}
        className="flex-1 rounded-lg bg-white px-4 py-2 dark:bg-gray-800"
      >
        <div className="relative flex items-center gap-2">
          <UserAvatar user={user} />
          <AddText
            trigger={
              <div
                className="w-full cursor-pointer rounded-full border-2 bg-gray-100 py-3 pl-5 text-start text-sm font-semibold text-muted-foreground dark:bg-gray-900"
                onClick={() => setPreview({})}
              >
                What's on your mind?
              </div>
            }
            title="What's on your mind?"
          />
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-center">
          <AddImages />

          <AddVideo />

          <AddText />

          {preview.text && <RemoveText />}
        </div>
        <Button
          type="submit"
          disabled={isPending || !preview}
          className="hidden"
          size="sm"
          hidden={true}
          ref={addPostRef}
        >
          Post
        </Button>
      </form>

      {preview.text || preview.items.length ? (
        <div className="relative mt-5 w-full rounded-md border p-2">
          <ExitPreview resetPreview={resetPreview} />

          <Preview />

          {!isDisabled && (
            <div className="my-2 flex justify-center">
              <Button
                type="submit"
                disabled={Boolean(isPending || isDisabled)}
                className="px-10"
                size="sm"
                onClick={() => {
                  addPostRef.current?.click();
                }}
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
      ) : null}
    </div>
  );
};
export default PostForm;
