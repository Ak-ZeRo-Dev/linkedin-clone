import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Post } from "@/db/models/post";
import { Comment } from "@/db/models/comment";
import { Button } from "@/components/ui/button";
import UserAvatar from "./UserAvatar";
import { IUser } from "@/types/user";

const UserInformation = async () => {
  const user = await currentUser();

  const { firstName, lastName, id: userId, imageUrl } = user || {};

  const posts = (await Post.find({ "user.userId": user?.id.toString() })) || [];

  const comments =
    (await Comment.find({ "user.userId": user?.id.toString() })) || [];

  const items = [
    {
      name: "posts",
      length: posts.length,
    },
    {
      name: "comments",
      length: comments.length,
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-border py-4 shadow-sm">
      <UserAvatar user={user as unknown as IUser} />

      <SignedIn>
        <div className="text-center">
          <p className="font-semibold">
            {firstName} {lastName}
          </p>
          <p className="text-xs">
            {`@${firstName}${lastName}-${userId?.slice(-4)}`.toLowerCase()}
          </p>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="space-y-2 text-center">
          <p className="font-semibold">You are not signed in.</p>
          <Button asChild className="bg-[#0b63c4] text-white">
            <SignInButton>Sign In</SignInButton>
          </Button>
        </div>
      </SignedOut>

      <SignedIn>
        <hr className="my-5 w-full border-border shadow-sm" />

        {items.map((item, index) => (
          <div
            key={item.name + index}
            className="flex w-full justify-between px-4 text-sm"
          >
            <p
              className="font-semibold capitalize text-gray-400 dark:text-gray-500"
              aria-label={item.name}
            >
              {item.name}
            </p>
            <p className="text-blue-400" aria-label={item.length.toString()}>
              {item.length}
            </p>
          </div>
        ))}
      </SignedIn>
    </div>
  );
};
export default UserInformation;
