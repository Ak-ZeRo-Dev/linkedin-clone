"use client";
import { cn } from "@/lib/utils";
import { usePreviewStore } from "@/store/previewStore";
import PostImages from "../PostImages";
import PostText from "../PostText";
import PostVideo from "../PostVideo";
import OrderItems from "./OrderItems";
import RemoveText from "./RemoveText";

function UserActions() {
  const { preview } = usePreviewStore();
  return (
    <div
      className={cn(
        "mt-2 flex flex-wrap items-center justify-center",
        preview.isPending && "pointer-events-none opacity-50",
      )}
    >
      <PostText />
      {preview.text && <RemoveText />}
      <PostImages />
      <PostVideo />
      {preview.items.length > 1 && <OrderItems />}
    </div>
  );
}
export default UserActions;
