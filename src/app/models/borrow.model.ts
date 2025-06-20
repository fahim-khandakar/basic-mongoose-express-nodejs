import { model, Schema } from "mongoose";
import { BorrowStaticMethods, IBorrow } from "../interfaces/borrow.interface";
import { IBooks } from "../interfaces/books.interface";
import { Book } from "./books.model";

const borrowSchema = new Schema<IBorrow, BorrowStaticMethods>(
  {
    book: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    dueDate: { type: Date, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

borrowSchema.static("updateAvailableStatus", async function (bookId: string) {
  const updated = await Book.findByIdAndUpdate(
    bookId,
    { available: false },
    { new: true }
  );
  return updated;
});

export const Borrow = model<IBorrow, BorrowStaticMethods>(
  "Borrow",
  borrowSchema
);
