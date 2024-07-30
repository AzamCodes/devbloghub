import { z } from "zod";

export const CreatePostSchema = z.object({
  title: z.string().min(8, "Title must be at least 8 characters long").trim(),
  slug: z
    .string()
    .min(4, "Slug must be at least 4 characters long")
    .trim()
    .refine(
      (slug) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug),
      "Slug must be kebab-case (lowercase letters, numbers, and hyphens)"
    ),
  img: z
    .string()
    .url() // Adjusted to accept base64 URLs
    .optional(),
  desc: z
    .string()
    .min(50, "Description must be at least 50 characters long")
    .trim(),
});
