"use client";
import React from "react";
import Link from "next/link";
import { CircleX, Section } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type Props = {
  error: Error;
  reset: () => void;
};

export default function ErrorPage({ error, reset }: Props) {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center">
      {/* Main content with fade-in animation */}
      <motion.div
        className="flex flex-col items-center justify-center text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h1
          className="mb-6 text-3xl font-bold md:text-5xl lg:text-6xl"
          aria-label="Oops! Something went wrong."
        >
          Oops! Something went wrong.
        </h1>
        <p
          className="mb-8 text-pretty px-4 text-lg sm:px-6 md:text-xl"
          aria-label={error.message}
        >
          {error.message}
        </p>

        {/* Buttons with hover effect */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            onClick={reset}
            className="rounded-lg bg-blue-600 px-6 py-2 text-white shadow-md transition-all hover:scale-105 hover:bg-blue-700"
            aria-label="Try Again"
          >
            Try Again
          </Button>
          <Button
            asChild
            className="rounded-lg bg-green-600 px-6 py-2 text-white shadow-md transition-all hover:scale-105 hover:bg-green-700"
            aria-label="Go Home"
          >
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </motion.div>

      {/* Lucide Icon with bounce animation */}
      <motion.div
        className="mt-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
      >
        <CircleX className="h-24 w-24 md:h-40 md:w-40" />
      </motion.div>
    </section>
  );
}
