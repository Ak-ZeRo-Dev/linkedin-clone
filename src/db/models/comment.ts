import { IUser } from "@/types/user";
import { Document, Schema, Model, model, models } from "mongoose";

export interface ICommentBase {
  postId: string;
  user: IUser;
  text: string;
}
export interface IComment extends Document, ICommentBase {
  replies: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    postId: { type: String, required: true },
    user: {
      type: {
        firstName: { type: String, required: true },
        lastName: String,
        imageUrl: { type: String, required: true },
        userId: { type: String, required: true },
      },
      required: true,
    },
    text: { type: String, required: true },
    replies: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true },
);

export const Comment: Model<IComment> =
  models.Comment || model<IComment>("Comment", CommentSchema);
