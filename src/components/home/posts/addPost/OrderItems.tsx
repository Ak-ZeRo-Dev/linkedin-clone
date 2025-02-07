import { usePreviewStore } from "@/store/previewStore";
import { Grip, ListOrderedIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";
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

const OrderItems = () => {
  const { preview, setPreview } = usePreviewStore();
  const [items, setItems] = useState(preview.items);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const closeRef = useRef<any>(null);
  const [isDisabled, setIsDisabled] = useState(true);

  // Sync items ONLY when the dialog opens
  const handleDialogOpen = () => {
    setItems(preview.items);
    setIsDisabled(true);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOverItem = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    setIsDisabled(false);

    setItems((prev) => {
      const updatedItems = [...prev];
      const draggedItem = updatedItems.splice(draggedIndex, 1)[0];
      updatedItems.splice(index, 0, draggedItem);

      return updatedItems; // Don't update `order` yet; do it on save
    });

    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSave = () => {
    const reorderedItems = items.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    setPreview({ items: reorderedItems });
    setItems(reorderedItems);
    toast.info("Items order updated successfully!");
    closeRef.current?.click();
  };

  return (
    <Dialog onOpenChange={handleDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          className="flex items-center gap-1"
        >
          <ListOrderedIcon />
          Order
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Order items</DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            Drag and drop to reorder
          </DialogDescription>
        </DialogHeader>

        <div className="flex max-h-96 flex-col gap-2 overflow-y-auto">
          {items.map((item, index) => (
            <Button
              variant="ghost"
              key={item._id}
              className="flex cursor-move items-center justify-start space-x-1 rounded-md"
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={() => handleDragOverItem(index)}
              onDragEnd={handleDragEnd}
            >
              <Grip className="pointer-events-none w-5 select-none" />
              <div className="pointer-events-none select-none">
                {item.type === "image" ? (
                  <Image
                    src={item.url}
                    alt={`image-${index}`}
                    width={50}
                    height={30}
                    className="rounded-md"
                  />
                ) : (
                  <div className="flex h-[30px] w-[50px] items-center justify-center rounded-md border-2 border-[#828282]">
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
            </Button>
          ))}
        </div>
        <DialogClose ref={closeRef} />

        <Button
          onClick={handleSave}
          className="mx-auto mt-2 w-20 rounded-md"
          disabled={isDisabled}
        >
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
};
export default OrderItems;
