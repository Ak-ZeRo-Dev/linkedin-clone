"use client";

import { NAV_LINKS } from "@/constants/constants";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import ModeToggle from "./ModeToggle";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled((prev) => (window.scrollY > 0 ? true : prev && false));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all",
        isScrolled && "bg-background/30 drop-shadow backdrop-blur-sm",
      )}
    >
      <div className="container-center p-2">
        <div className="flex items-center max-md:justify-between">
          {/* Logo */}
          <Image
            src="/logo.png"
            alt="linkedin clone logo"
            width={40}
            height={40}
            className="rounded-lg"
          />

          {/* Search Bar */}
          <div className="md:flex md:flex-1 md:items-center md:justify-between">
            <form className="mx-2 hidden max-w-96 flex-1 items-center space-x-1 rounded-md bg-gray-100 p-2 dark:bg-gray-800 md:flex">
              <SearchIcon className="h-4 text-gray-600" />
              <Input
                type="text"
                placeholder="Search"
                className="input-reset flex-1 bg-transparent"
              />
            </form>

            {/* Navigation */}
            <div className="flex items-center space-x-4 px-6">
              {NAV_LINKS.map(({ href, icon: Icon, label, hiddenOnMobile }) => (
                <Link
                  key={label}
                  href={href}
                  className={cn("icon", hiddenOnMobile && "hidden md:flex")}
                >
                  <Icon className="h-5" />
                  <p>{label}</p>
                </Link>
              ))}

              <ModeToggle />

              {/* Authentication */}
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
      </div>
    </header>
  );
};

export default Header;
