import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import VideoPlayer from "@/components/VideoPlayer";
import { IEditMedia, useEditStore } from "@/store/postStore";
import { XIcon } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

const RemoveMedia = ({ media }: { media: IEditMedia }) => {
  const { removeMedia } = useEditStore();
  const ref = useRef<HTMLButtonElement>(null);

  const handleDelete = () => {
    removeMedia(media._id!);
    ref.current?.click();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="icon"
          className="h-6 w-6 rounded-full"
        >
          <XIcon className="w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-h-[500px] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove this{" "}
            {media.type === "image" ? "image" : "video"}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        {media.type === "image" ? (
          <Image
            src={media.url}
            alt="image"
            width={500}
            height={300}
            loading="lazy"
            className="w-full object-cover"
          />
        ) : (
          <VideoPlayer url={media.url} videoClasses="w-full h-30" />
        )}
        <AlertDialogFooter>
          <Button asChild variant="destructive" onClick={handleDelete}>
            <AlertDialogAction>Delete</AlertDialogAction>
          </Button>
          <AlertDialogCancel ref={ref}>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default RemoveMedia;
