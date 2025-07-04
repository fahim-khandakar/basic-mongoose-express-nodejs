import express, { Request, Response } from "express";
import { Borrow } from "../models/borrow.model";
import { Book } from "../models/books.model";
import { CreateBorrowZodSchema } from "../Schema/borrow.schema";

export const borrowRoutes = express.Router();

// Create a new borrow entry
borrowRoutes.post("/", async (req: Request, res: Response) => {
  const body = req.body;

  CreateBorrowZodSchema.parse(body);

  const data = await Borrow.create(body);

  res.status(200).json({
    success: true,
    message: "Book borrowed successfully",
    data,
  });
});

// Get all borrowed books summary
borrowRoutes.get("/", async (req: Request, res: Response) => {
  const data = await Borrow.aggregate([
    {
      $group: {
        _id: "$book",
        totalQuantity: { $sum: "$quantity" },
      },
    },
    {
      $lookup: {
        from: "books",
        localField: "_id",
        foreignField: "_id",
        as: "bookDetails",
      },
    },
    {
      $unwind: "$bookDetails",
    },
    {
      $project: {
        _id: 0,
        book: {
          title: "$bookDetails.title",
          isbn: "$bookDetails.isbn",
        },
        totalQuantity: 1,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    message: "Borrowed books summary retrieved successfully",
    data,
  });
});
