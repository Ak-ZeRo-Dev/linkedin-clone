import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Button } from "../ui/button";
import UserAvatar from "../UserAvatar";

const UserInformation = async () => {
  const user = await currentUser();

  const { firstName, lastName, id: userId, imageUrl } = user || {};

  const items = [
    {
      name: "posts",
      length: 10,
    },
    {
      name: "comments",
      length: 10,
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-border py-4 shadow-sm">
      <UserAvatar user={user} />

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

      <hr className="my-5 w-full border-border shadow-sm" />

      {items.map((item, index) => (
        <div
          key={item.name + index}
          className="flex w-full justify-between px-4 text-sm"
        >
          <p className="font-semibold capitalize text-gray-400 dark:text-gray-500">
            {item.name}
          </p>
          <p className="text-blue-400">{item.length}</p>
        </div>
      ))}
    </div>
  );
};
export default UserInformation;
