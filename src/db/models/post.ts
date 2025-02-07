import { IUser } from "@/types/user";
import { Document, Schema, Model, model, models } from "mongoose";
import { Comment, IComment, ICommentBase } from "./comment";
import { IPostSchema } from "@/types/post";
import cloudinary from "@/lib/cloudinary";
import path from "path";
import { COMMENTS_LIMIT } from "@/constants/constants";

export interface IPostBase {
  user: IUser;
  text?: string | null;
  images?: {
    url: string;
    public_id: string;
    order: number;
    _id?: string;
  }[];
  video?: {
    url: string;
    order: number;
    _id?: string;
  };
  comments?: IComment[];
  likes?: string[];
}

export interface IPost extends Document, IPostBase {
  createdAt: Date;
  updatedAt: Date;
}

interface IPostMethods {
  likePost(userId: string): Promise<void>;
  unlike(userId: string): Promise<void>;
  addComment(comment: ICommentBase): Promise<void>;
  removeComment(commentId: string, userId: string): Promise<void>;
  removePost(): Promise<void>;
  updatePost(post: IPostSchema): Promise<void>;
  updateComment(
    userId: string,
    commentId: string,
    comment: string,
  ): Promise<void>;
}

interface IPostStatics {
  getAllPosts(limit: number, skip: number): Promise<IPostDocument[] | null>;
}

export interface IPostDocument extends IPost, IPostMethods {}
export interface IPostModel extends IPostStatics, Model<IPostDocument> {}

const postSchema = new Schema<IPostDocument>(
  {
    user: {
      type: {
        firstName: { type: String, required: true },
        lastName: String,
        imageUrl: { type: String, required: true },
        userId: { type: String, required: true },
      },
      required: true,
    },
    text: String,
    images: [
      {
        url: String,
        public_id: String,
        order: Number,
      },
    ],
    video: {
      url: String,
      order: Number,
    },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment", default: [] }],
    likes: [String],
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

    await this.model("Post").findByIdAndUpdate(this._id, {
      $addToSet: { comments: createdComment._id },
    });
  } catch (error: any) {
    throw new Error(error.message || "Failed to add comment");
  }
};

postSchema.methods.removeComment = async function (
  commentId: string,
  userId: string,
) {
  try {
    const comment = await Comment.findById(commentId);

    if (!comment) throw new Error("Comment Not Found.");

    if (comment.user.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await comment.deleteOne({ _id: commentId });
    await this.updateOne({ $pull: { comments: commentId } });
  } catch (error) {
    console.error(`Error removing comment: ${error}`);
  }
};

postSchema.methods.updateComment = async function (
  userId: string,
  commentId: string,
  comment: string,
) {
  try {
    const newComment = await Comment.findById(commentId);

    if (!newComment) throw new Error("Comment Not Found.");

    if (newComment.user.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await Comment.updateOne({ _id: commentId }, { $set: { text: comment } });
    await this.updateOne({ $set: { comments: commentId } });
  } catch (error: any) {
    throw new Error(error.message || "Failed to update comment");
  }
};

postSchema.methods.removePost = async function () {
  try {
    await this.model("Post").deleteOne({ _id: this._id });
  } catch (error: any) {
    throw new Error(error.message || "Failed to remove post");
  }
};

postSchema.methods.updatePost = async function (post: IPostBase) {
  try {
    await this.updateOne({ $set: post });
  } catch (error) {
    console.error(`Error updating post: ${error}`);
  }
};

postSchema.statics.getAllPosts = async function (limit, skip) {
  try {
    const posts = await this.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const postsWithComments = await Promise.all(
      posts.map(async (post: IPost) => {
        const comments = await Comment.find({ postId: post._id })
          .sort({ createdAt: -1 })
          .limit(COMMENTS_LIMIT)
          .lean();

        const totalComments = await Comment.countDocuments({
          postId: post._id,
        });

        return { ...post, comments, totalComments };
      }),
    );

    return JSON.parse(JSON.stringify(postsWithComments));
  } catch (error: any) {
    throw new Error(`Error getting posts: ${error.message}`);
  }
};

export const Post =
  (models.Post as IPostModel) ||
  model<IPostDocument, IPostModel>("Post", postSchema);
