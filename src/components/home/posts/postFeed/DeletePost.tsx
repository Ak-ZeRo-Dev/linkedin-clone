"use client";
import { deletePostAction } from "@/actions/post/deletePostAction";
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
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";

const DeletePost = ({ postId }: { postId: string }) => {
  const handleDelete = async () => {
    try {
      const res = await deletePostAction(postId);

      if (!res.success) {
        throw new Error(res.error || "Failed to delete post");
      }

      toast.success("Post deleted successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete post");
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger className="w-full" asChild>
        <Button variant="ghost" size="sm">
          <Trash2Icon className="h-4 w-4" />
          Delete
          <span className="sr-only">Delete</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this post?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-white hover:bg-destructive/70"
            onClick={handleDelete}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default DeletePost;
