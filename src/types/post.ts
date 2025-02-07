import { IComment } from "@/db/models/comment";
import { IPostBase, IPostDocument } from "@/db/models/post";

export interface PreviewItem {
  type: "image" | "video";
  url: string;
  _id?: string;
  file?: File;
  order: number;
}

export type IPostSchema = Pick<IPostBase, "text" | "video"> & {
  images?: Pick<PreviewItem, "file" | "order">[];
};

export interface IPostDocumentExtended extends IPostDocument {
  comments: IComment[];
  totalComments: number;
}
