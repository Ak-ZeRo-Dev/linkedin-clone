import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { PreviewState, usePreviewStore } from "@/store/previewStore";
import { PreviewItem } from "@/types/post";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import { Button } from "../../../ui/button";
import UserActions from "./UserActions";
import VideoPlayer from "@/components/VideoPlayer";

const cardClasses = "relative m-0 h-60 w-full p-0";

const RemoveMedia = ({
  type,
  setPreview,
  items,
  index = 0,
  removeClass = "",
}: {
  type: "image" | "video";
  setPreview: (data: Partial<PreviewState["preview"]>) => void;
  items?: PreviewItem[];
  index?: number;
  removeClass?: string;
}) => {
  const handleDelete = () => {
    if (type === "image") {
      const updatedItems = items?.filter((_, i) => i !== index) || [];
      setPreview({ items: updatedItems });
    } else {
      setPreview({ items: [] });
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "absolute right-2 top-2 h-4 w-4 transition-colors hover:text-[#0a66c4]",
        removeClass,
      )}
      onClick={handleDelete}
    >
      <Trash2Icon />
    </Button>
  );
};

const AllPreview = ({
  preview,
  setPreview,
}: {
  preview: PreviewState["preview"];
  setPreview: (data: Partial<PreviewState["preview"]>) => void;
}) => {
  return (
    <Carousel className="rounded-md" opts={{ loop: true }}>
      <CarouselContent>
        {preview.items.map((item: PreviewItem, index: number) => (
          <CarouselItem
            key={`${item.type}-${index}`}
            className="overflow-hidden rounded-md"
          >
            <Card className="relative h-full">
              <CardContent className={cardClasses}>
                <RemoveMedia
                  type={item.type}
                  setPreview={setPreview}
                  items={preview.items}
                  index={index}
                />
                {item.type === "video" ? (
                  <VideoPlayer url={item.url} />
                ) : (
                  <Image
                    loading="lazy"
                    src={item.url}
                    alt={`image-${index}`}
                    width={600}
                    height={200}
                    className="pointer-events-none h-full w-full select-none object-cover"
                  />
                )}
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2 border-none bg-transparent text-main" />
      <CarouselNext className="right-2 border-none bg-transparent text-main" />
    </Carousel>
  );
};

const Preview = () => {
  const { preview, setPreview } = usePreviewStore();

  const isVideo = preview.items.filter((item) => item.type === "video");
  const isImage = preview.items.filter((item) => item.type === "image");

  const hasContent = preview.text || preview.items.length > 0;
  return (
    <div className="mx-auto grid w-[95%] place-content-center space-y-2 overflow-hidden lg:mx-0 lg:w-full">
      <div
        className={cn(
          hasContent
            ? "max-h-96 overflow-y-auto rounded-md border p-2"
            : "hidden",
        )}
      >
        {preview.text && <p className="mb-2">{preview.text}</p>}

        <div>
          {preview.items.length > 1 && (
            <AllPreview preview={preview} setPreview={setPreview} />
          )}
          {Boolean(isVideo.length === 1 && !isImage.length) ||
          Boolean(isImage.length === 1 && !isVideo.length) ? (
            <Card className="relative">
              <CardContent className={cardClasses}>
                <RemoveMedia
                  type={
                    isVideo.length === 1 && !isImage.length ? "video" : "image"
                  }
                  setPreview={setPreview}
                  items={preview.items}
                />
                {isVideo.length === 1 && !isImage.length ? (
                  <VideoPlayer url={isVideo[0].url} />
                ) : (
                  <Image
                    loading="lazy"
                    src={isImage[0].url}
                    alt="image"
                    width={600}
                    height={200}
                    className="pointer-events-none h-full w-full select-none object-cover"
                  />
                )}
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
      {hasContent && <hr />}

      <UserActions />
    </div>
  );
};

export default Preview;
