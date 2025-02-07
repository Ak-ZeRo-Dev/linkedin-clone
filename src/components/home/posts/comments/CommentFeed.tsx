"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { IPostDocument } from "@/db/models/post";
import { useUser } from "@clerk/nextjs";
import { use, useEffect, useState, useTransition } from "react";
import ReactTimeago from "react-timeago";
import UserAvatar from "../../user/UserAvatar";
import { IUser } from "@/types/user";
import EditComment from "./EditComment";
import DeleteComment from "./DeleteComment";
import { IComment } from "@/db/models/comment";
import { getCommentsAction } from "@/actions/comments/getCommentsAction";
import { COMMENTS_LIMIT } from "@/constants/constants";

type Props = {
  initialComments: IComment[];
  postId: string;
};

const CommentFeed = ({ initialComments, postId }: Props) => {
  const { user } = useUser();

  const [page, setPage] = useState(1);
  const [comments, setComments] = useState<IComment[]>([]);

  useEffect(() => {
    setComments((prev) => [...initialComments]);
  }, [initialComments]);

  const [hasMore, setHasMore] = useState(
    initialComments.length >= COMMENTS_LIMIT,
  );

  const [isPending, startTransition] = useTransition();

  const loadMoreComments = () => {
    startTransition(async () => {
      if (!hasMore) return;

      const next = page + 1;
      const res = await getCommentsAction(postId, next);

      if (!res.success) {
        throw new Error(res.error || "Something went wrong");
      }

      if (res.comments.length === 0) {
        setHasMore(false);
        return;
      }

      setComments((prev) => [...prev, ...res.comments]);
      setPage((prev) => prev + 1);
    });
  };

  const handleShowLess = async () => {
    const res = await getCommentsAction(postId, 1);

    if (!res.success) {
      throw new Error(res.error || "Something went wrong");
    }

    setComments(res.comments);
    setPage(1);
    setHasMore(true);
  };

  return (
    <div>
      {!comments.length ? (
        <div className="mt-3">
          <p className="text-center text-sm text-muted-foreground">
            No comments yet.
          </p>
        </div>
      ) : (
        <>
          {comments?.map(
            ({
              _id,
              user: { firstName, lastName, userId, imageUrl },
              text,
              createdAt,
              postId,
            }) => {
              const isAuthor = user ? Boolean(user.id === userId) : false;
              return (
                <div key={_id as string} className="mt-3">
                  <div className="flex w-full space-x-1 md:space-x-2">
                    <div className="mt-1">
                      <UserAvatar
                        user={{ firstName, lastName, userId, imageUrl }}
                      />
                    </div>
                    <div className="w-full flex-1 rounded-md bg-secondary px-4 py-2">
                      <div className="-space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-semibold">
                              {firstName} {lastName}
                              {isAuthor && (
                                <Badge
                                  variant="outline"
                                  className="ml-1 border border-muted-foreground text-xs"
                                >
                                  Author
                                </Badge>
                              )}
                            </div>

                            <p className="text-xs text-muted-foreground">
                              <ReactTimeago date={new Date(createdAt)} />
                            </p>
                          </div>

                          <div className="space-x-2">
                            <EditComment
                              text={text}
                              commentId={_id as string}
                              postId={postId}
                            />
                            <DeleteComment
                              postId={postId}
                              commentId={_id as string}
                            />
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground">
                          @{firstName}
                          {lastName}-{userId?.toString().slice(-4)}
                        </p>
                      </div>

                      <p className="mt-3 text-sm">{text}</p>
                    </div>
                  </div>
                </div>
              );
            },
          )}

          <div className="flex gap-2">
            {hasMore && (
              <div className="w-full">
                <Button
                  className="mt-2 w-full"
                  variant="outline"
                  onClick={loadMoreComments}
                  disabled={isPending}
                >
                  {isPending ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : (
                    "Load more comments"
                  )}
                </Button>
              </div>
            )}

            {comments.length > COMMENTS_LIMIT && (
              <Button
                className="mt-2 w-full"
                variant="outline"
                onClick={handleShowLess}
              >
                Show less
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};
export default CommentFeed;
