import express, { Request, Response } from "express";
import { Borrow } from "../models/borrow.model";
import { Book } from "../models/books.model";
import { z } from "zod";

export const borrowRoutes = express.Router();

const CreateBorrowZodSchema = z.object({
  book: z.string({ required_error: "Book ID is required" }),
  quantity: z
    .number({
      required_error: "Quantity is required",
    })
    .min(1, { message: "Quantity must be at least 1" }),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
});

borrowRoutes.post("/", async (req: Request, res: Response) => {
  const { quantity, book } = req.body;

  CreateBorrowZodSchema.safeParse(req.body);

  if (!book || typeof quantity !== "number") {
    res.status(400).json({
      success: false,
      message: "Invalid input: 'book' and 'quantity' are required.",
    });
    return;
  }

  const singleBook = await Book.findById(book).lean();
  if (!singleBook) {
    res.status(404).json({
      success: false,
      message: "Book not found",
    });
    return;
  }

  const availableCopies = singleBook.copies || 0;

  if (availableCopies === 0) {
    await Borrow.updateAvailableStatus(book);
    res.status(400).json({
      success: false,
      message: "No copies available for borrowing",
    });
    return;
  } else if (availableCopies < quantity) {
    res.status(400).json({
      success: false,
      message: "Not enough copies available",
    });
    return;
  }
  await Book.findByIdAndUpdate(book, {
    copies: availableCopies - quantity,
  });

  const data = await Borrow.create(req.body);

  res.status(200).json({
    success: true,
    message: "Book borrowed successfully",
    data,
  });
});

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
