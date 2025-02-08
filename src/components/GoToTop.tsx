"use client";
import { ArrowUpIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useScroll } from "@/hooks/use-scroll";
import { motion } from "framer-motion";

const GoToTop = () => {
  const scrolled = useScroll();

  const goTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };
  return scrolled ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Button
        variant="ghost"
        className="fixed bottom-5 right-5 h-8 w-8 rounded-full bg-main text-white shadow-lg transition-colors hover:bg-main/90"
        aria-label="Go to Top"
        onClick={goTop}
      >
        <ArrowUpIcon />
      </Button>
    </motion.div>
  ) : null;
};
export default GoToTop;
