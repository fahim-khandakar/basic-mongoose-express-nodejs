import { z } from "zod";

export const CreateUserZodSchema = z.object({
  title: z.string({ required_error: "Title is required" }),
  author: z.string({ required_error: "Author is required" }),
  genre: z.enum(
    ["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"],
    { required_error: "Genre is required" }
  ),
  isbn: z.string({ required_error: "ISBN is required" }),
  description: z.string().optional(),
  copies: z.number({ required_error: "Copies is required" }).min(0, {
    message: "Copies must be a positive number",
  }),
  available: z.boolean().optional(),
});

export const UpdateUserZodSchema = z.object({
  title: z.string().optional(),
  author: z.string().optional(),
  genre: z
    .enum([
      "FICTION",
      "NON_FICTION",
      "SCIENCE",
      "HISTORY",
      "BIOGRAPHY",
      "FANTASY",
    ])
    .optional(),
  isbn: z.string().optional(),
  description: z.string().optional(),
  copies: z
    .number()
    .min(0, {
      message: "Copies must be a positive number",
    })
    .optional(),
  available: z.boolean().optional(),
});
