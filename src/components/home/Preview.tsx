import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { PreviewItem, usePreviewStore } from "@/store/previewStore";
import { IPreview } from "@/types/types";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import AddImages from "./AddImages";
import AddText from "./AddText";
import AddVideo from "./AddVideo";
import RemoveText from "./RemoveText";

const cardClasses = "relative m-0 h-60 w-full p-0";

const RemoveMedia = ({
  type,
  setPreview,
  items,
  index = 0,
  removeClass = "",
}: {
  type: "image" | "video";
  setPreview: (data: Partial<IPreview>) => void;
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

const VideoPlayer = ({ url }: { url: string }) => {
  let embedUrl = url;
  let title = "Preview video";

  try {
    const parsedUrl = new URL(url);

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId =
        parsedUrl.searchParams.get("v") || parsedUrl.pathname.split("/").pop();
      embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      title = "YouTube video player";
    } else if (url.includes("vimeo.com")) {
      const videoId = parsedUrl.pathname.split("/").pop();
      embedUrl = `https://player.vimeo.com/video/${videoId}?autoplay=1`;
      title = "Vimeo video player";
    } else if (url.includes("drive.google.com")) {
      // Extract the file ID from the Google Drive URL
      const fileId = parsedUrl.pathname.includes("/file/d/")
        ? parsedUrl.pathname.split("/file/d/")[1]?.split("/")[0]
        : parsedUrl.searchParams.get("id");
      if (fileId) {
        embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
        title = "Google Drive video player";
      }
    }
  } catch (error) {
    console.error("Invalid URL:", error);
  }

  return (
    <div className="media-container">
      <iframe
        src={embedUrl}
        title={title}
        frameBorder="0"
        allow="encrypted-media; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        loading="lazy"
        className="h-[240px] w-[446.55px] object-cover"
      ></iframe>
    </div>
  );
};

const AllPreview = ({
  preview,
  setPreview,
}: {
  preview: IPreview;
  setPreview: (data: Partial<IPreview>) => void;
}) => {
  return (
    <Carousel className="max-w-md rounded-md" opts={{ loop: true }}>
      <CarouselContent>
        {preview.items.map((item, index) => (
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
      <div className={cn(hasContent ? "rounded-md border p-2" : "hidden")}>
        {preview.text && <p className="mb-2">{preview.text}</p>}

        <div className="media-container grid place-content-center">
          {preview.items.length > 1 && (
            <AllPreview preview={preview} setPreview={setPreview} />
          )}
          {Boolean(isVideo.length === 1 && !isImage.length) ||
          Boolean(isImage.length === 1 && !isVideo.length) ? (
            <Card className="relative h-full">
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

      <div className="my-1 flex w-full flex-wrap items-center justify-center">
        <AddImages />
        <AddVideo />
        <AddText />
        {preview.text && <RemoveText />}
      </div>
    </div>
  );
};

export default Preview;
