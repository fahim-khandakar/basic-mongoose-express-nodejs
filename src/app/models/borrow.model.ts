import mongoose, { model, Schema, Types } from "mongoose";
import { BorrowStaticMethods, IBorrow } from "../interfaces/borrow.interface";
import { Book } from "./books.model";

const borrowSchema = new Schema<IBorrow, BorrowStaticMethods>(
  {
    book: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Book" },
    quantity: { type: Number, required: true, min: 1 },
    dueDate: { type: Date, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

borrowSchema.static(
  "updateAvailableStatus",
  async function (bookId: string | Types.ObjectId) {
    const updated = await Book.findByIdAndUpdate(
      bookId,
      { available: false },
      { new: true }
    );
    return updated;
  }
);

borrowSchema.pre("save", async function (next) {
  const singleBook = await Book.findById(this.book).lean();

  if (!singleBook) {
    next(new Error("Book not found"));
    return;
  }

  const availableCopies = singleBook.copies || 0;

  if (availableCopies === 0) {
    await Borrow.updateAvailableStatus(this.book);
    next(new Error("No copies available for this book"));

    return;
  } else if (availableCopies < this.quantity) {
    console.log("hello");
    next(new Error("Not enough copies available for this book"));

    return;
  }

  const updatedBook = await Book.findByIdAndUpdate(
    this.book,
    {
      copies: availableCopies - this.quantity,
    },
    { new: true }
  );

  if (updatedBook?.copies === 0) {
    await Borrow.updateAvailableStatus(this.book);
  }

  next();
});

borrowSchema.post("save", async function (doc, next) {
  try {
    const updatedBook = await Book.findById(doc.book).lean();
    if ((updatedBook?.copies ?? 0) === 0) {
      await Borrow.updateAvailableStatus(doc.book);
    }
    next();
  } catch (error) {
    next(error as mongoose.CallbackError);
  }
});

export const Borrow = model<IBorrow, BorrowStaticMethods>(
  "Borrow",
  borrowSchema
);
