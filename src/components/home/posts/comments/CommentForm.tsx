"use client";
import { addCommentAction } from "@/actions/comments/addCommentAction";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { IUser } from "@/types/user";
import { useUser } from "@clerk/nextjs";
import { useActionState } from "react";
import { toast } from "sonner";
import UserAvatar from "../../user/UserAvatar";

type Props = {
  postId: string;
};
const CommentForm = ({ postId }: Props) => {
  const { user } = useUser();

  const handleSubmit = async (
    prevState: any,
    formData: FormData,
  ): Promise<any> => {
    try {
      if (!user) return { success: false, error: "User not found" };

      formData.append("postId", postId.toString());

      const result = await addCommentAction(formData);
      if (!result.success) {
        throw new Error(result.error || "Failed to add comment");
      }
      toast.success("Comment added successfully!");
      return { success: true, error: null };
    } catch (error: any) {
      toast.error(error.message || "Failed to add comment");
      return { success: false, error: error.message || "Something went wrong" };
    }
  };

  const [state, action, isPending] = useActionState(handleSubmit, {
    success: false,
    error: null,
  });
  return (
    <form action={action}>
      <div className="flex space-x-2">
        <UserAvatar user={user as unknown as IUser} />
        <div className="flex flex-1 flex-col gap-1">
          <Textarea
            placeholder="Write a comment..."
            name="text"
            autoSave="true"
            value={state.text}
            className="resize-none"
          />

          <Button
            type="submit"
            variant="default"
            size="sm"
            className="self-end"
          >
            {isPending ? (
              <span className="flex animate-pulse items-center gap-2">
                <span className="hidden md:block">Adding comment...</span>

                <span className="block md:hidden">Adding...</span>
              </span>
            ) : (
              <>
                <span className="hidden md:block">Add Comment</span>

                <span className="block md:hidden">Add</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};
export default CommentForm;
