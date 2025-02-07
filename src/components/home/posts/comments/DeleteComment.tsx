import { deleteCommentAction } from "@/actions/comments/deleteCommentAction";
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
import { toast } from "sonner";

const DeleteComment = ({
  postId,
  commentId,
}: {
  postId: string;
  commentId: string;
}) => {
  const handleDelete = async () => {
    try {
      const result = await deleteCommentAction(postId, commentId);

      if (!result.success) {
        throw new Error(result.error || "Failed to delete comment");
      }

      toast.success("Comment deleted successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete comment");
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="link" size="sm" className="w-fit px-0">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this comment?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default DeleteComment;
