import { IUser } from "@/types/user";
import { Document, Schema, Model, model, models } from "mongoose";

export interface ICommentBase {
  user: IUser;
  text: string;
}
export interface IComment extends Document, ICommentBase {
  createdAt: Date;
  updatedAt: Date;
  replies: IComment[];
}

const CommentSchema = new Schema<IComment>(
  {
    user: {
      type: {
        firstName: { type: String, required: true },
        lastName: String,
        imageUrl: { type: String, required: true },
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
