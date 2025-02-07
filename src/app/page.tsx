import { getPostsAction } from "@/actions/post/getPostsAction";
import PostForm from "@/components/home/posts/addPost/PostForm";
import PostFeed from "@/components/home/posts/postFeed/PostFeed";
import UserInformation from "@/components/home/user/UserInformation";
import Widget from "@/components/home/widget/Widget";
import LoadingSpinner from "@/components/LoadingSpinner";
import { SignedIn } from "@clerk/nextjs";
import { Suspense } from "react";

export const revalidate = 0;

export default function Home() {
  return (
    <div className="mt-5 grid grid-cols-8 gap-2 sm:px-5">
      <section className="hidden md:col-span-2 md:inline">
        <UserInformation />
      </section>

      <section className="col-span-full h-fit w-[90%] space-y-5 max-md:mx-auto md:col-span-6 md:w-full xl:col-span-4 xl:mx-auto xl:max-w-xl">
        <SignedIn>
          <PostForm />
        </SignedIn>

        <Suspense
          fallback={
            <div className="flex w-full justify-center">
              <LoadingSpinner />
            </div>
          }
        >
          <PostList />
        </Suspense>
      </section>

      <section className="hidden justify-center xl:col-span-2 xl:inline-block">
        <Widget />
      </section>
    </div>
  );
}

async function PostList() {
  const { posts } = await getPostsAction();
  return posts && posts.length > 0 ? (
    <PostFeed initialPosts={posts} />
  ) : (
    <p className="text-center text-2xl font-semibold">No posts yet</p>
  );
}
