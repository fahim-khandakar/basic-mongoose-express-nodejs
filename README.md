# 📚 Library API - Mongoose, Express, TypeScript & Zod

This project is a simple library management API built with **Express**, **Mongoose**, **TypeScript**, and **Zod** for validation.

It includes:

- Book management (CRUD)
- Borrow management
- Data validation using `zod`
- Mongoose hooks & custom statics

---

## 📦 Models

### 📘 Book Model

```ts
const bookSchema = new Schema<IBooks>(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre: {
      type: String,
      required: true,
      enum: [
        "FICTION",
        "NON_FICTION",
        "SCIENCE",
        "HISTORY",
        "BIOGRAPHY",
        "FANTASY",
      ],
    },
    isbn: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
    copies: { type: Number, required: true, min: 0 },
    available: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);
```

### 🔁 Borrow Model

```ts
const borrowSchema = new Schema<IBorrow>(
  {
    book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    quantity: { type: Number, required: true, min: 1 },
    dueDate: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false }
);

// Hooks and static methods manage availability and copy tracking.
```

---

## 📂 API Routes

### 📗 Book Routes

#### `POST /books`

- Creates a book.
- Validated using `CreateUserZodSchema`.

#### `GET /books`

- Returns all books.
- Supports: `?filter=GENRE&sortBy=FIELD&sort=asc|desc&limit=NUMBER`

#### `GET /books/:bookId`

- Gets a single book by ID.

#### `PATCH /books/:bookId`

- Updates a book.
- Revalidates availability based on copies.

#### `DELETE /books/:bookId`

- Deletes a book.

### 📕 Borrow Routes

#### `POST /borrow`

- Borrows a book.
- Validated using `CreateBorrowZodSchema`.
- Automatically decreases book copies.

#### `GET /borrow`

- Returns borrowed books summary (total borrowed per book).

---

## ✅ Validation (Zod)

- All incoming `POST` and `PATCH` requests are validated using **Zod** schemas before interacting with the database.

---

## 📌 Future Ideas

- Return functionality to increase copies
- Borrower tracking
- Overdue fines & history

---

## 🛠 Tech Stack

- Node.js
- Express
- TypeScript
- MongoDB (via Mongoose)
- Zod (validation)
