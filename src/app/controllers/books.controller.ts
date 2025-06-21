import express, { Request, Response } from "express";
import { Book } from "../models/books.model";
import { z } from "zod";

export const booksRoutes = express.Router();

const CreateUserZodSchema = z.object({
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

const UpdateUserZodSchema = z.object({
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

booksRoutes.post("/", async (req: Request, res: Response) => {
  const body = req.body;

  CreateUserZodSchema.parse(body);

  const data = await Book.create(body);

  res.status(200).json({
    success: true,
    message: "Book created successfully",
    data,
  });
});

booksRoutes.get("/", async (req: Request, res: Response) => {
  const { filter, sort, limit, sortBy } = req.query;
  console.log("Query Parameters:", { filter, sort, limit, sortBy });

  const filterQuery: Record<string, any> = {};
  if (filter) {
    filterQuery.genre = filter;
  }

  const data = await Book.find(filterQuery)
    .sort({ [sortBy as string]: sort === "asc" ? 1 : -1 })
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    message: "Books retrieved successfully",
    data,
  });
});

booksRoutes.get("/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;

  const data = await Book.findById(bookId);

  res.status(200).json({
    success: true,
    message: "Book retrieved successfully",
    data,
  });
});

booksRoutes.delete("/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;

  await Book.findByIdAndDelete(bookId);

  res.status(200).json({
    success: true,
    message: "Book deleted successfully",
    data: null,
  });
});
booksRoutes.patch("/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  const updatedBody = req.body;

  UpdateUserZodSchema.parse(updatedBody);

  const existingBook = await Book.findById(bookId);
  if (!existingBook) {
    res.status(404).json({
      success: false,
      message: "Book not found",
    });
    return;
  }

  if (
    (existingBook.available === false && existingBook.copies === 0) ||
    updatedBody.data.available === true
  ) {
    updatedBody.data.available = true;
  }

  const data = await Book.findByIdAndUpdate(bookId, updatedBody.data, {
    new: true,
  });

  res.status(200).json({
    success: true,
    message: "Book updated successfully",
    data,
  });
});
