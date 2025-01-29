import { PreviewItem } from "@/store/previewStore";
import { Dispatch, SetStateAction } from "react";
export interface IPreview {
  text?: string;
  items: PreviewItem[];
}

export interface IPost {
  text: string;
  items: PreviewItem[];
}

export interface IImage {
  url: string;
  id: string;
  public_id: string;
  order: number;
}
