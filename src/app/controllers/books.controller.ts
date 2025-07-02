import express, { Request, Response } from "express";
import { Book } from "../models/books.model";
import { Borrow } from "../models/borrow.model";
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
  console.log("body", body);

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
booksRoutes.get(
  "/:bookId",
  async (req: Request, res: Response): Promise<void> => {
    const bookId = req.params.bookId;

    try {
      const book = await Book.findById(bookId).lean();

      if (!book) {
        res.status(404).json({
          success: false,
          message: "Book not found",
        });
        return;
      }

      const borrows = await Borrow.find({ book: bookId }).lean();

      const response = {
        ...book,
        totalTimesBorrowed: borrows.length,
        totalBorrowedQuantity: borrows.reduce((acc, b) => acc + b.quantity, 0),
        remainingCopies: book.copies,
        borrowHistory: borrows,
      };

      res.status(200).json({
        success: true,
        message: "Book details retrieved successfully",
        data: response,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  }
);

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
