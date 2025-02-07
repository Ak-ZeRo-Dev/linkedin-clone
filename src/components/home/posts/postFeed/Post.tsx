"use client";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IPostDocument } from "@/db/models/post";
import { cn } from "@/lib/utils";
import { IPostDocumentExtended } from "@/types/post";
import { IUser } from "@/types/user";
import { useUser } from "@clerk/nextjs";
import { EllipsisVertical } from "lucide-react";
import Image from "next/image";
import React, { useMemo } from "react";
import ReactTimeago from "react-timeago";
import VideoPlayer from "../../../VideoPlayer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../../ui/carousel";
import UserAvatar from "../../user/UserAvatar";
import EditPost from "../editPost/EditPost";
import DeletePost from "./DeletePost";
import PostOptions from "./PostOptions";

const heightContainer = "h-[300px] md:h-[400px]";

const AllPreview = ({ items }: { items: any[] }) => (
  <Carousel className="w-full" opts={{ loop: true }}>
    <CarouselContent className="mx-0 w-full flex-1">
      {items.map((item, index) => {
        const isImage = !!item.public_id;
        return (
          <CarouselItem
            key={item._id + index}
            className={cn("w-full px-2", heightContainer)}
          >
            <div
              className={cn("h-full w-full overflow-hidden", heightContainer)}
            >
              {isImage ? (
                <Image
                  loading="lazy"
                  src={item.url}
                  alt={`image-${item.order}`}
                  width={500}
                  height={500}
                  className="h-full w-full object-cover"
                />
              ) : (
                <VideoPlayer url={item.url} videoClasses={heightContainer} />
              )}
            </div>
          </CarouselItem>
        );
      })}
    </CarouselContent>
    <CarouselPrevious className="left-2 border-none bg-transparent text-main" />
    <CarouselNext className="right-2 border-none bg-transparent text-main" />
  </Carousel>
);

const Post = ({ post }: { post: IPostDocument }) => {
  const { user } = useUser();
  const userInfo = post.user as unknown as IUser;
  const { userId, firstName, lastName } = userInfo || {};
  const { text, images, video, createdAt } = post;

  const isAuthor = user?.id === userId;
  const formattedDate = new Date(createdAt);

  const items = useMemo(
    () =>
      [...(images ?? []), ...(video ? [video] : [])]
        .filter(Boolean)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [images, video],
  );

  return (
    <div className="rounded-md border-2 border-border shadow-sm">
      {/* Header */}
      <div className="flex space-x-2 p-4">
        <UserAvatar user={userInfo} />
        <div className="flex flex-1 justify-between">
          <div className="space-y-0.5">
            <div className="font-semibold">
              {firstName} {lastName}
              {isAuthor && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  Author
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              @{firstName}
              {lastName}-{userId?.toString().slice(-4)}
            </p>
            <p className="text-xs text-muted-foreground">
              <ReactTimeago date={formattedDate} />
            </p>
          </div>

          {/* Update & Delete Post */}
          {isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger aria-label="Options">
                <EllipsisVertical className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  <EditPost post={post} />
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>
                  <DeletePost postId={post._id as string} />
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div>
        {text?.trim() && <p className="mt-2 px-4 pb-2">{text}</p>}

        {(images?.length || video) && (
          <div className={cn("w-full overflow-hidden", heightContainer)}>
            {images?.length === 1 && !video && (
              <div
                className={cn("h-full w-full overflow-hidden", heightContainer)}
              >
                <Image
                  src={images[0].url}
                  alt="image"
                  width={500}
                  height={500}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {video && !images?.length && (
              <div className="px-2">
                <VideoPlayer url={video.url} videoClasses={heightContainer} />
              </div>
            )}

            {items.length > 1 && <AllPreview items={items} />}
          </div>
        )}
      </div>

      {/* Post Options */}
      <PostOptions post={post as IPostDocumentExtended} />
    </div>
  );
};

export default Post;
