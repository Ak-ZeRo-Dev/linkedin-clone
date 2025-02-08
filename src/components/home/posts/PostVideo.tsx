import { cn } from "@/lib/utils";
import { useEditStore } from "@/store/postStore";
import { usePreviewStore } from "@/store/previewStore";
import { XIcon, YoutubeIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
import { Input } from "../../ui/input";

const PostVideo = ({ type = "add" }: { type?: "add" | "edit" }) => {
  const { addItem, preview } = usePreviewStore();
  const { data, addItem: PostVideo, setData } = useEditStore();
  const isAddType = type === "edit" ? data : preview;
  const video = isAddType.items?.find((item) => item.type === "video");

  const [url, setUrl] = useState<string>(video?.url || "");
  const closeRef = useRef<any>(null);

  const urlSchema = z.string().url().safeParse(url);

  const handlePostVideo = () => {
    if (url && urlSchema.success) {
      if (type === "edit") {
        if (data.items?.find((item) => item.type === "video")) {
          setData({
            ...data,
            items: data.items.map((item) => {
              if (item.type === "video") {
                return { ...item, url };
              }
              return item;
            }),
          });
        } else {
          PostVideo({
            type: "video",
            url,
            order: (data.items ?? []).length + 1,
          });
        }
      } else {
        addItem({
          type: "video",
          url,
          order: preview.items.length + 1,
        });
      }

      closeRef.current?.click();
    } else {
      toast.error("Invalid URL");
    }
  };

  const handleOpen = () => {
    setUrl(video?.url || "");
  };

  return (
    <Dialog onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="flex items-center gap-1"
        >
          <YoutubeIcon className="h-4 w-4" />
          <span className="text-xs">{url ? "Update" : "Add"} video</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{url ? "Update" : "Add"} URL video</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Input
            type="url"
            placeholder="https://example.com/video.mp4"
            name="video"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full"
          />
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute right-1 top-1/2 h-5 w-5 -translate-y-1/2 transform rounded-full",
              url ? "block" : "hidden",
            )}
            onClick={() => setUrl("")}
          >
            <XIcon className="w-4" />
          </Button>
        </div>
        <DialogFooter>
          <DialogClose ref={closeRef} className="hidden" hidden></DialogClose>
          <Button type="button" size="sm" onClick={handlePostVideo}>
            {url ? "Update" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default PostVideo;
