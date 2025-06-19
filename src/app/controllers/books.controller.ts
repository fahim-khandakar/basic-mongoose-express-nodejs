import express, { Request, Response } from "express";
import { Book } from "../models/books.model";

export const booksRoutes = express.Router();

booksRoutes.post("/", async (req: Request, res: Response) => {
  const body = req.body;
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

  const data = await Book.findByIdAndUpdate(bookId, updatedBody, {
    new: true,
  });

  res.status(200).json({
    success: true,
    message: "Book updated successfully",
    data,
  });
});
