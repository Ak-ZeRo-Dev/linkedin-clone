import { IUser } from "@/types/user";
import { Document, Schema, Model, model, models } from "mongoose";
import { Comment, IComment } from "./comment";
import { PreviewItem } from "@/store/previewStore";

export interface IPostBase {
  user: IUser;
  text?: string;
  items: {
    type: "image" | "video";
    url: string;
    id: string;
    public_id?: string;
    order?: number;
  };
  comments?: IComment[];
  likes?: string[];
  dislikes?: string[];
}

export interface IPost extends Document, IPostBase {
  createdAt: Date;
  updatedAt: Date;
}

interface IPostMethods {
  likePost(userId: string): Promise<void>;
  unlike(userId: string): Promise<void>;
  addComment(comment: IComment): Promise<void>;
  removeComment(commentId: string): Promise<void>;
  getAllComments(limit?: number, skip?: number): Promise<IComment[]>;
  removePost(): Promise<void>;
}

interface IPostStatics {
  getAllPosts(): Promise<IPost[]>;
}

export interface IPostDocument extends IPost, IPostMethods {
  type: string;
}
interface IPostModel extends IPostStatics, Model<IPostDocument> {}

const ItemsSchema = new Schema<IPostBase["items"]>({
  type: {
    type: String,
    enum: ["image", "video"],
    required: true,
  },
  order: { type: Number, required: true },
  url: { type: String, required: true },
  public_id: {
    type: String,
    required: function () {
      return this.type === "image";
    },
    default: "",
  },
});

const postSchema = new Schema<IPostDocument>(
  {
    user: {
      type: {
        firstName: { type: String, required: true },
        lastName: String,
        imageUrl: { type: String, required: true },
      },
      required: true,
    },
    text: String,
    items: [ItemsSchema],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment", default: [] }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

postSchema.methods.likePost = async function (userId: string) {
  try {
    await this.updateOne({ $addToSet: { likes: userId } });
  } catch (error) {
    console.error(`Error liking post: ${error}`);
  }
};

postSchema.methods.unlike = async function (userId: string) {
  try {
    await this.updateOne({ $pull: { likes: userId } });
  } catch (error) {
    console.error(`Error removing like: ${error}`);
  }
};

postSchema.methods.addComment = async function (comment: IComment) {
  try {
    const createdComment = await Comment.create(comment);
    await this.updateOne({ $addToSet: { comments: createdComment._id } });
  } catch (error) {
    console.error(`Error adding comment: ${error}`);
  }
};

// postSchema.methods.removeComment = async function (commentId: string) {
//   try {
//     const comment = await Comment.findById(commentId);
//     if (comment) {
//       await comment.remove();
//     }
//     await this.updateOne({ $pull: { comments: commentId } });

//   } catch (error) {
//     console.error(`Error removing comment: ${error}`);
//   }
// };

postSchema.methods.getAllComments = async function (limit = 10, skip = 0) {
  try {
    const post = await this.populate({
      path: "comments",
      options: { sort: { createdAt: -1 }, limit, skip },
    });
    return this.comments;
  } catch (error) {
    console.error(`Error getting comments: ${error}`);
    return [];
  }
};

postSchema.methods.removePost = async function () {
  try {
    await this.model("Post").deleteOne({ _id: this._id });
  } catch (error) {
    console.error(`Error removing post: ${error}`);
  }
};

postSchema.statics.getAllPosts = async function () {
  try {
    const posts = await this.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
      })
      .lean();
    return posts;
  } catch (error) {
    console.error(`Error getting posts: ${error}`);
    return [];
  }
};

export const Post =
  models.Post || model<IPostDocument, IPostModel>("Post", postSchema);
