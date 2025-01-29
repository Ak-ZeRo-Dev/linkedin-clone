import * as z from "zod";

export const postSchema = z
  .object({
    text: z.string().optional(),
    items: z
      .array(
        z.object({
          type: z.enum(["image", "video"]),
          url: z.string(),
          id: z.string().optional(),
          file: z.instanceof(File).optional(),
          order: z.number().optional(),
        }),
      )
      .optional(),
  })
  .refine(
    (data) => data.text?.trim() || (data.items && data.items.length > 0),
    {
      message: "At least one field (text, images, or videos) must be provided.",
    },
  );
