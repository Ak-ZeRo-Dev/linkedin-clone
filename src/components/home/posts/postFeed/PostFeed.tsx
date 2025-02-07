"use client";
import { IPostDocument } from "@/db/models/post";
import Post from "./Post";
import { getPostsAction } from "@/actions/post/getPostsAction";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useInView, motion } from "framer-motion";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Props {
  initialPosts: IPostDocument[];
}

const PostFeed = ({ initialPosts }: Props) => {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<IPostDocument[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const [isPending, startTransition] = useTransition();

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  const loadMorePosts = useCallback(() => {
    startTransition(async () => {
      const data = await getPostsAction(page + 1);

      if (!data.success) {
        throw new Error(data.error);
      }

      if (data.posts?.length === 0) {
        setHasMore(false);
        return;
      }

      setPosts((prev) => [...(prev ?? []), ...(data.posts ?? [])]);
      setPage((prev) => prev + 1);
    });
  }, [page]);

  useEffect(() => {
    if (inView) {
      loadMorePosts();
    }
  }, [inView, loadMorePosts]);

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  return (
    <div className="space-y-2 pb-20">
      {posts.map((post: IPostDocument) => (
        <Post key={post._id as string} post={post} />
      ))}

      {hasMore || isPending ? (
        <motion.div
          ref={ref}
          className="flex justify-center"
          initial={{ y: 0, opacity: 0, scale: 0 }}
          animate={{ y: 10, opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LoadingSpinner />
        </motion.div>
      ) : (
        <motion.div
          ref={ref}
          className="text-center text-sm text-muted-foreground"
        >
          No more posts
        </motion.div>
      )}
    </div>
  );
};

export default PostFeed;
