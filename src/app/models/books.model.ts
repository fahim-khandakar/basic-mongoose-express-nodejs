import { model, Schema } from "mongoose";
import { IBooks } from "../interfaces/books.interface";

const bookSchema = new Schema<IBooks>(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "FICTION",
        "NON_FICTION",
        "SCIENCE",
        "HISTORY",
        "BIOGRAPHY",
        "FANTASY",
      ],
    },
    isbn: { type: String, required: true, trim: true, unique: true },
    description: { type: String, trim: true },
    copies: { type: Number, required: true, min: 0 },
    available: { type: Boolean, default: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

bookSchema.pre("save", function (next) {
  next();
});

bookSchema.post("save", function (doc, next) {
  console.log(`[LOG] Book created: ${doc.title} (ID: ${doc._id})`);
  next();
});

export const Book = model<IBooks>("Book", bookSchema);
