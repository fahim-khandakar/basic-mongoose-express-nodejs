import { z } from "zod";

export const CreateBorrowZodSchema = z.object({
  book: z.string({ required_error: "Book ID is required" }),
  quantity: z
    .number({
      required_error: "Quantity is required",
    })
    .min(1, { message: "Quantity must be at least 1" }),
  dueDate: z
    .string({ required_error: "Due date is required" })
    .transform((val) => new Date(val))
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format",
    }),
});
