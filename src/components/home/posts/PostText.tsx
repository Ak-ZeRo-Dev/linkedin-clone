"use client";

import { useEditStore } from "@/store/postStore";
import { usePreviewStore } from "@/store/previewStore";
import { TextIcon } from "lucide-react";
import { ReactElement, useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Textarea } from "../../ui/textarea";

const PostText = ({
  trigger,
  title,
  type = "add",
}: {
  trigger?: ReactElement;
  title?: string;
  type?: "add" | "edit";
}) => {
  const { preview, setPreview } = usePreviewStore();
  const { data, setData } = useEditStore();
  const isAddType = type === "add" ? preview : data;
  const text = isAddType.text || "";

  const [currentText, setCurrentText] = useState<string>(text);

  const updateText = () => {
    const textSchema = z.string().safeParse(currentText);
    if (textSchema.success) {
      if (type === "edit") {
        setData({ text: currentText });
      } else {
        setPreview({ text: currentText });
      }
    } else {
      toast.error("Invalid text");
    }
  };

  const handleOpen = () => {
    setCurrentText(text);
  };

  return (
    <Dialog onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <TextIcon className="w-4" />
            {currentText ? "Update" : "Add"} Text
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {title ? title : currentText ? "Update Text" : "Add Text"}
          </DialogTitle>
        </DialogHeader>
        <Textarea
          rows={5}
          value={currentText}
          name="text"
          onChange={(e) => setCurrentText(e.target.value)}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={updateText}>Save</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PostText;
