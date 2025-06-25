import express, { Application, Request, Response } from "express";
import { booksRoutes } from "./app/controllers/books.controller";
import { borrowRoutes } from "./app/controllers/borrow.controller";
import { globalErrorHandler } from "./app/config/globalErrorHandler";

const app: Application = express();

app.use(express.json());

app.use("/api/books", booksRoutes);
app.use("/api/borrow", borrowRoutes);

// Global error handler
app.use(globalErrorHandler);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Book Store App");
});

export default app;
