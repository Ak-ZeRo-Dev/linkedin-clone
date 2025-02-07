"use client";
import { likeAction } from "@/actions/like-unlike/likeAction";
import { unlikeAction } from "@/actions/like-unlike/unlikeAction";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IPostDocumentExtended } from "@/types/post";
import { SignedIn, useUser } from "@clerk/nextjs";
import { MessageCircle, Repeat, Send, ThumbsUpIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CommentFeed from "../comments/CommentFeed";
import CommentForm from "../comments/CommentForm";

type Props = {
  post: IPostDocumentExtended;
};

const UIButton = ({ children }: { children: React.ReactNode }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost">{children}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>This Button For UI Only</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          <p>Not implemented yet</p>
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const PostOptions = ({ post }: Props) => {
  const { user } = useUser();
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes || []);

  useEffect(() => {
    if (post.likes?.includes(user?.id as string)) {
      setLiked(true);
    }
  }, [post, user]);

  const likeOrUnlikePost = async () => {
    try {
      if (liked) {
        const res = await unlikeAction(post._id as string, user?.id as string);

        if (!res) return;

        if (!res.success) {
          throw new Error(res.error || "Something went wrong");
        }
        setLikes((prev) => prev?.filter((id) => id !== user?.id));
        setLiked(false);
      } else {
        const res = await likeAction(post._id as string, user?.id as string);

        if (!res) return;

        if (!res.success) {
          throw new Error(res.error || "Something went wrong");
        }
        setLikes((prev) => [...(prev || []), user?.id as string]);
        setLiked(true);
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div>
      {Boolean(
        (likes && likes.length > 0) ||
          (post.comments && post.comments.length > 0),
      ) && (
        <div className="flex items-center justify-between p-4">
          <div>
            {likes && likes.length > 0 && (
              <p className="cursor-pointer text-sm text-muted-foreground transition-all hover:underline">
                {likes.length} likes
              </p>
            )}
          </div>

          <div>
            {post.comments && post.comments.length > 0 && (
              <p
                onClick={() => setIsCommentOpen((prev) => !prev)}
                className="cursor-pointer text-sm text-muted-foreground transition-all hover:underline"
              >
                {post.totalComments} comments
              </p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 border-t">
        <Button variant="ghost" onClick={likeOrUnlikePost}>
          <ThumbsUpIcon
            className={cn("mr-1", liked && "fill-main text-main")}
          />
          Like
        </Button>

        <Button
          variant="ghost"
          onClick={() => setIsCommentOpen((prev) => !prev)}
        >
          <MessageCircle
            className={cn("mr-1", isCommentOpen && "fill-main text-main")}
          />
          Comment
        </Button>

        <UIButton>
          <Repeat className="mr-1" />
          Repost
        </UIButton>

        <UIButton>
          <Send className="mr-1" />
          Send
        </UIButton>
      </div>

      {isCommentOpen && (
        <div className="p-4">
          <SignedIn>
            <CommentForm postId={post._id as string} />
          </SignedIn>

          <CommentFeed
            initialComments={post.comments || []}
            postId={post._id as string}
          />
        </div>
      )}
    </div>
  );
};
export default PostOptions;
