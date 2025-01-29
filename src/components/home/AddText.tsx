"use client";

import { usePreviewStore } from "@/store/previewStore";
import { ReactElement, useEffect, useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";

const AddText = ({
  trigger,
  title,
}: {
  trigger?: ReactElement;
  title?: string;
}) => {
  const { preview, setPreview } = usePreviewStore();
  const [currentText, setCurrentText] = useState<string>(preview.text || "");

  const updateText = () => {
    const textSchema = z.string().safeParse(currentText);
    if (textSchema.success) {
      setPreview({ text: currentText });
    } else {
      toast.error("Invalid text");
    }
  };

  useEffect(() => {
    setCurrentText(preview.text || "");
  }, [preview.text]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant="ghost" size="sm">
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
          onChange={(e) => setCurrentText(e.target.value)}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={updateText} disabled={!currentText}>
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddText;
