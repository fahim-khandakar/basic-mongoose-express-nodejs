import express, { Request, Response } from "express";
import { Book } from "../models/books.model";
import { z } from "zod";
import {
  CreateUserZodSchema,
  UpdateUserZodSchema,
} from "../Schema/book.schema";

export const booksRoutes = express.Router();

// Book create api
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

// Get all books api
booksRoutes.get("/", async (req: Request, res: Response) => {
  const { filter, sort, limit, sortBy } = req.query;

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

// Get single book api
booksRoutes.get("/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;

  const data = await Book.findById(bookId);

  res.status(200).json({
    success: true,
    message: "Book retrieved successfully",
    data,
  });
});

// Delete book api
booksRoutes.delete("/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;

  await Book.findByIdAndDelete(bookId);

  res.status(200).json({
    success: true,
    message: "Book deleted successfully",
    data: null,
  });
});

// Update book api
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
    (existingBook.available === false &&
      existingBook.copies === 0 &&
      updatedBody.copies > 0) ||
    updatedBody.available === true
  ) {
    updatedBody.available = true;
  }

  const data = await Book.findByIdAndUpdate(bookId, updatedBody, {
    new: true,
  });

  res.status(200).json({
    success: true,
    message: "Book updated successfully",
    data,
  });
});
