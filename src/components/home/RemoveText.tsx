import { usePreviewStore } from "@/store/previewStore";
import { XIcon } from "lucide-react";
import { Button } from "../ui/button";

const RemoveText = () => {
  const { setPreview } = usePreviewStore();
  return (
    <Button
      variant="ghost"
      type="button"
      size="sm"
      onClick={() => setPreview({ text: "" })}
      className="flex items-center gap-1 self-end"
    >
      <XIcon className="w-4" />
      Remove text
    </Button>
  );
};
export default RemoveText;
