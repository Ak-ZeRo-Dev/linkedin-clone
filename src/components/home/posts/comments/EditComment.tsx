import { editCommentAction } from "@/actions/comments/editCommentAction";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  use,
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { toast } from "sonner";

const EditComment = ({
  text,
  commentId,
  postId,
}: {
  text: string;
  commentId: string;
  postId: string;
}) => {
  const [updateText, setUpdateText] = useState(text);
  const [isPending, startTransition] = useTransition();

  const ref = useRef<HTMLFormElement>(null);
  const closeRef = useRef<any>(null);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUpdateText(event.target.value);
  };

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        const res = await editCommentAction(postId, commentId, updateText);

        if (!res.success) {
          throw new Error(res.error || "Something went wrong");
        }

        ref.current?.reset();
        setUpdateText("");
        closeRef.current?.click();
        toast.success("Comment edited successfully!");
      } catch (error: any) {
        toast.error(error.message || "Something went wrong");
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="w-fit px-0">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Comment</DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} ref={ref} className="flex flex-col">
          <Textarea
            placeholder="Edit comment"
            value={updateText}
            name="text"
            onChange={handleChange}
            className="resize-none"
          />
          <div className="mt-5 space-x-3 self-end">
            <DialogClose asChild ref={closeRef}>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default EditComment;
