"use client";
import { IEditMedia, useEditStore } from "@/store/postStore";
import { usePreviewStore } from "@/store/previewStore";
import { PreviewItem } from "@/types/post";
import { randomBytes } from "crypto";
import { ImageIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../ui/carousel";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

const PostImages = ({ type = "add" }: { type?: "add" | "edit" }) => {
  const { preview } = usePreviewStore();
  const { data } = useEditStore();
  const [isDragActive, setIsDragActive] = useState(false);
  const [images, setImages] = useState<PreviewItem[] | IEditMedia[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const closeRef = useRef<any>(null);
  const isAddType = type === "add";

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
        const startOrder = prev.length + 1;
        const imageUrls: PreviewItem[] = [...files].map((file, index) => ({
          type: "image",
          url: URL.createObjectURL(file),
          _id: randomBytes(16).toString("hex"),
          file,
          order: startOrder + index,
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
      order: index + 1,
    }));

    if (isAddType) {
      usePreviewStore.setState((state) => ({
        preview: {
          ...state.preview,
          items: [
            ...state.preview.items.filter((item) => item.type !== "image"),
            ...reorderedImages,
          ],
        },
      }));
    } else {
      useEditStore.setState((state) => ({
        data: {
          ...state.data,
          items: [
            ...(state.data.items?.filter((item) => item.type !== "image") ??
              []),
            ...reorderedImages,
          ],
        },
      }));
    }

    closeRef.current.click();
  };

  const handleOpen = () => {
    setImages(
      (isAddType ? preview : data)?.items?.filter(
        (item) => item.type === "image",
      ) || [],
    );
  };

  const RemoveBtn = ({
    index = 0,
    id,
  }: {
    index?: number;
    id?: string | null;
  }) => {
    const handleDelete = (id: string | null) => {
      setImages((prev) =>
        prev.filter((ele, i) => {
          if (id) {
            return ele._id !== id;
          } else {
            return i !== index;
          }
        }),
      );
    };
    return (
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-1 top-1 h-4 w-4 transition-colors hover:text-[#0a66c4]"
        onClick={() => handleDelete(id || null)}
      >
        <Trash2Icon />
      </Button>
    );
  };

  return (
    <div>
      <Dialog onOpenChange={handleOpen}>
        <DialogTrigger className="flex-center w-fit gap-1" asChild>
          <Button variant="ghost" type="button" size="sm">
            <ImageIcon className="h-4 w-4" />
            <span className="sr-only">Add image</span>
            <span className="text-xs">Add image</span>
          </Button>
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
              max={5}
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
                    {images.map((image, index) => (
                      <CarouselItem
                        key={`${image.type}-${index}`}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={() => handleDragOverItem(index)}
                        onDragEnd={handleDragEnd}
                        className="flex justify-center pl-1 md:basis-1/2 lg:basis-1/3"
                      >
                        <Card className="relative w-48 overflow-hidden rounded-md border border-muted shadow-md">
                          <CardContent className="relative aspect-square p-0">
                            <RemoveBtn index={index} id={image._id || null} />
                            <Image
                              src={image.url}
                              alt={`${image.type}-${index}`}
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
                    <RemoveBtn id={images[0]._id || null} />
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
                disabled={
                  images.length ===
                  (data.items?.filter((item) => item.type === "image")
                    ?.length || 0)
                }
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

export default PostImages;
