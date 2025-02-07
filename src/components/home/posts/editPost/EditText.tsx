import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEditStore } from "@/store/postStore";
import { ChangeEvent } from "react";

const EditText = () => {
  const { data, setData } = useEditStore();

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setData({ text: e.target.value });
  };

  return (
    <div>
      <Label>Text</Label>
      <Textarea
        className="h-24 resize-none overflow-y-auto"
        value={data.text}
        name="text"
        onChange={handleChange}
      />
    </div>
  );
};
export default EditText;
