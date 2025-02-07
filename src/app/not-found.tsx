"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <section className="grid min-h-dvh w-full place-content-center">
      <div className="text-center">
        <h2
          className="font-Rubik -mb-28 font-bold uppercase"
          aria-label="Page Not Found"
        >
          Page Not Found
        </h2>
        <h1
          className="select-none pr-20 text-[250px] font-black uppercase tracking-[-40px]"
          aria-label="404"
        >
          {[4, 0, 4].map((num) => (
            <span
              key={num}
              className="drop-shadow-offset-light dark:drop-shadow-offset-dark"
            >
              {num}
            </span>
          ))}
        </h1>

        <h3
          className="font-Rubik -mt-16 text-base font-bold"
          aria-label="Sorry We Could Not Find This Page"
        >
          Sorry We Could Not Find This Page
        </h3>

        <div className="mt-5 flex items-center justify-center gap-10">
          <Button onClick={() => router.back()} aria-label="Back">
            <ArrowLeft className="text-lg font-bold" />
            <span className="text-lg font-bold">Back</span>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="bg-main hover:bg-main/80"
            aria-label="Home"
          >
            <Link href={"/"}>Home</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
