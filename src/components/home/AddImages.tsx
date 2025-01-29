"use client";
import { PreviewItem, usePreviewStore } from "@/store/previewStore";
import { randomBytes } from "crypto";
import { ImageIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import {
  ChangeEvent,
  Dispatch,
  DragEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const RemoveMedia = ({
  setImages,
  index = 0,
}: {
  setImages: Dispatch<SetStateAction<PreviewItem[]>>;
  index?: number;
}) => {
  const handleDelete = () => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="absolute right-1 top-1 h-4 w-4 transition-colors hover:text-[#0a66c4]"
      onClick={handleDelete}
    >
      <Trash2Icon />
    </Button>
  );
};

const AddImages = () => {
  const { preview } = usePreviewStore();
  const [isDragActive, setIsDragActive] = useState(false);
  const [images, setImages] = useState<PreviewItem[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const closeRef = useRef<any>(null);

  // Handle drag and drop
  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragActive(false);

    const files = event.dataTransfer.files;
    handleImageUpload(files);
  };

  // Drag-and-drop reorder handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOverItem = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;

    setImages((prev) => {
      const updatedImages = [...prev];
      const draggedItem = updatedImages.splice(draggedIndex, 1)[0];
      updatedImages.splice(index, 0, draggedItem);

      // Update the order for all items
      return updatedImages.map((item, idx) => ({
        ...item,
        order: idx + 1,
      }));
    });

    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    handleImageUpload(files);
  };

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      setImages((prev) => {
        const startOrder = prev.length + 1; // Start order from the current array length
        const imageUrls: PreviewItem[] = [...files].map((file, index) => ({
          type: "image",
          url: URL.createObjectURL(file),
          id: randomBytes(5).toString("hex"),
          file,
          order: startOrder + index, // Assign incremental order
        }));

        return [...prev, ...imageUrls];
      });
    } else {
      toast.error("No image selected");
    }
  };

  const handleSave = () => {
    const reorderedImages = images.map((image, index) => ({
      ...image,
      order: index + 1, // Update order based on the new position
    }));

    usePreviewStore.setState((state) => ({
      preview: {
        ...state.preview,
        items: [
          ...state.preview.items.filter((item) => item.type !== "image"), // Retain non-image items
          ...reorderedImages, // Save reordered images
        ],
      },
    }));

    toast.success("Image order updated successfully!");
    closeRef.current.click();
  };

  useEffect(() => {
    const images = preview.items.filter((item) => item.type === "image");
    setImages(images);
  }, [preview]);

  return (
    <div>
      <Dialog>
        <DialogTrigger className="flex-center w-fit gap-1">
          <ImageIcon className="h-4 w-4" />
          <span className="sr-only">Add image</span>
          <span className="text-xs">Add image</span>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add image</DialogTitle>
          </DialogHeader>

          <div>
            <Button
              type="button"
              variant="ghost"
              className="cursor-pointer"
              asChild
            >
              <Label
                htmlFor="image"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex-center h-32 w-full cursor-pointer rounded-md border-2 border-dashed ${
                  isDragActive ? "border-primary" : "border-muted"
                }`}
              >
                <div className="text-center">
                  <ImageIcon className="mx-auto h-6 w-6 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Drag & drop images here, or click to select
                  </p>
                </div>
              </Label>
            </Button>
            <Input
              type="file"
              accept="image/*"
              name="images"
              multiple
              id="image"
              className="hidden"
              hidden
              onChange={handleFileChange}
            />

            {images.length > 1 && (
              <div className="mx-auto flex w-full justify-center">
                <Carousel
                  className="mt-4 w-full max-w-sm cursor-pointer"
                  opts={{
                    align: "start",
                    dragFree: true,
                    watchDrag: false,
                  }}
                >
                  <CarouselContent className="-ml-1">
                    {images.map(({ url, type }, index) => (
                      <CarouselItem
                        key={`${type}-${index}`}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={() => handleDragOverItem(index)}
                        onDragEnd={handleDragEnd}
                        className="flex justify-center pl-1 md:basis-1/2 lg:basis-1/3"
                      >
                        <Card className="relative w-48 overflow-hidden rounded-md border border-muted shadow-md">
                          <CardContent className="relative aspect-square p-0">
                            <RemoveMedia setImages={setImages} index={index} />
                            <Image
                              src={url}
                              alt={`${type}-${index}`}
                              width={100}
                              height={100}
                              className="h-full w-full object-cover"
                            />
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            )}

            {images.length === 1 && (
              <div className="mt-2 flex w-full justify-center">
                <Card className="relative h-32 w-48 overflow-hidden rounded-md border border-muted shadow-md">
                  <CardContent className="relative aspect-square p-0">
                    <RemoveMedia setImages={setImages} />
                    <Image
                      src={images[0].url}
                      alt="image-1"
                      width={100}
                      height={100}
                      className="h-full w-full object-cover"
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            <DialogClose hidden className="hidden" ref={closeRef} />
            <div className="mt-3 flex w-full justify-center">
              <Button
                size="sm"
                variant="default"
                onClick={() => handleSave()}
                disabled={!images.length}
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddImages;
