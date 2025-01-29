import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  Briefcase,
  HomeIcon,
  MessageSquareIcon,
  SearchIcon,
  UserIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import ModeToggle from "./ModeToggle";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b">
      <div className="container-center flex items-center p-2">
        <Image
          src="/logo.png"
          alt="linkedin clone logo"
          width={40}
          height={40}
          className="rounded-lg"
        />

        <div className="flex flex-1 items-center justify-between">
          <form className="mx-2 flex max-w-96 flex-1 items-center space-x-1 rounded-md bg-gray-100 p-2 dark:bg-gray-800">
            <SearchIcon className="h-4 text-gray-600" />
            <Input
              type="text"
              placeholder="Search"
              className="input-reset flex-1 bg-transparent"
            />
          </form>

          <div className="flex items-center space-x-4 px-6">
            <Link href="/" className="icon">
              <HomeIcon className="h-5" />
              <p>Home</p>
            </Link>

            <Link href="/" className="icon hidden md:flex">
              <UserIcon className="h-5" />
              <p>Network</p>
            </Link>

            <Link href="/" className="icon hidden md:flex">
              <Briefcase className="h-5" />
              <p>Jobs</p>
            </Link>

            <Link href="/" className="icon">
              <MessageSquareIcon className="h-5" />
              <p>Messaging</p>
            </Link>

            <ModeToggle />

            <div>
              <SignedOut>
                <Button asChild variant="secondary">
                  <SignInButton />
                </Button>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
