import express, { Request, Response } from "express";

export const booksRoutes = express.Router();

booksRoutes.post("/create-book", async (req: Request, res: Response) => {
  const body = req.body;

  res.status(201).json({
    success: true,
    message: "Book created successfully",
  });
});
booksRoutes.get("/", async (req: Request, res: Response) => {
  res.status(201).json({
    success: true,
    message: "Books fetched successfully",
  });
});
booksRoutes.get("/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;

  res.status(201).json({
    success: true,
    message: "Book fetched successfully",
  });
});
booksRoutes.delete("/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;

  res.status(201).json({
    success: true,
    message: "Book deleted successfully",
  });
});
booksRoutes.patch("/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  const updatedBody = req.body;

  res.status(201).json({
    success: true,
    message: "Note updated successfully",
  });
});
