import { cn } from "@/lib/utils";
import { toast } from "sonner";

const VideoPlayer = ({
  url,
  width = "100%",
  height = "315",
  videoClasses,
}: {
  url: string;
  width?: string;
  height?: string;
  videoClasses?: string;
}) => {
  let embedUrl = url;
  let title = "Preview video";

  try {
    if (!url) throw new Error("URL is undefined or empty");
    const parsedUrl = new URL(url);

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId =
        parsedUrl.searchParams.get("v") || parsedUrl.pathname.split("/").pop();
      embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`;
      title = "YouTube video player";
    } else if (url.includes("vimeo.com")) {
      const videoId = parsedUrl.pathname.split("/").pop();
      embedUrl = `https://player.vimeo.com/video/${videoId}?autoplay=0`;
      title = "Vimeo video player";
    } else if (url.includes("drive.google.com")) {
      const fileId = parsedUrl.pathname.includes("/file/d/")
        ? parsedUrl.pathname.split("/file/d/")[1]?.split("/")[0]
        : parsedUrl.searchParams.get("id") || "";

      if (fileId) {
        embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
        title = "Google Drive video player";
      }
    }
  } catch (error) {
    toast.error("Invalid URL");
  }

  return (
    <div className="media-container relative overflow-hidden">
      <iframe
        src={embedUrl}
        title={title}
        frameBorder="0"
        allow=" encrypted-media; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        loading="lazy"
        width={width}
        height={height}
        className={cn("m-0 h-full w-full object-cover p-0", videoClasses)}
      ></iframe>
    </div>
  );
};

export default VideoPlayer;
