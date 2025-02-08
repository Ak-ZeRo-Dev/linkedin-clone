import { useEditStore } from "@/store/postStore";

import { FolderCog, Grip } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "../../../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../ui/dialog";
import RemoveMedia from "./RemoveMedia";

const EditMedia = () => {
  const { data, setData } = useEditStore();

  const [items, setItems] = useState(data.items);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const closeRef = useRef<any>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOverItem = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    setData({ isOrdered: false });

    setItems((prev) => {
      const updatedItems = [...(prev || [])];
      const draggedItem = updatedItems.splice(draggedIndex, 1)[0];
      updatedItems.splice(index, 0, draggedItem);

      return updatedItems;
    });

    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSave = () => {
    const reorderedItems = items?.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    setData({ items: reorderedItems, isOrdered: true });
    setItems(reorderedItems);

    closeRef.current?.click();
  };

  useEffect(() => {
    if (!items?.length) {
      setItems(data.items);
    }
  }, [data, items]);

  const handleOpen = () => {
    setItems(data.items);
  };

  return (
    <Dialog onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          className="flex items-center gap-1"
        >
          <FolderCog />
          Edit Images & Video
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
            Order & Delete items
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            Drag and drop to reorder
            <br />
            <span className="text-xs">
              Changes will be saved after submit the edit post form "Edit Post
              Button".
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex max-h-96 flex-col gap-2 overflow-y-auto">
          {items?.map((item, index) => (
            <div key={item._id || `item-${index}`} className="w-full">
              <Button
                variant="ghost"
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={() => handleDragOverItem(index)}
                onDragEnd={handleDragEnd}
                className="flex h-fit w-full cursor-move items-center justify-between"
              >
                <div className="flex items-center space-x-1">
                  <Grip className="pointer-events-none w-5 select-none" />
                  <div className="pointer-events-none select-none">
                    {item.type === "image" ? (
                      <Image
                        src={item.url}
                        alt={`image-${index}`}
                        width={50}
                        height={40}
                        className="h-[40px] w-[50px] rounded-md object-cover"
                      />
                    ) : (
                      <div className="flex h-[35px] w-[50px] items-center justify-center rounded-md border-2 border-[#828282]">
                        <Image
                          src="/play-video-1.svg"
                          alt="play-video"
                          width={20}
                          height={20}
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <RemoveMedia media={item} />
              </Button>
              {index !== items.length - 1 && <hr />}
            </div>
          ))}
        </div>
        <DialogClose ref={closeRef} />

        <Button
          onClick={handleSave}
          className="mx-auto mt-2 w-20 rounded-md"
          disabled={data.isOrdered}
        >
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
};
export default EditMedia;
