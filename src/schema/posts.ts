import { IPostSchema } from "@/types/post";
import * as z from "zod";

export const postSchema: z.ZodType<IPostSchema> = z
  .object({
    text: z.string().optional(),
    images: z
      .array(
        z.object({
          file: z.instanceof(File),
          order: z.number(),
        }),
      )
      .optional(),
    video: z
      .object({
        url: z.string(),
        order: z.number(),
      })
      .optional(),
  })
  .refine(
    (data) =>
      data.text?.trim() ||
      (data.images && data.images.length > 0) ||
      data.video,
    {
      message: "At least one field (text, images, or videos) must be provided.",
    },
  );
