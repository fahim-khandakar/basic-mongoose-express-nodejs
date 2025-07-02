import express, { Application, NextFunction, Request, Response } from "express";
import { booksRoutes } from "./app/controllers/books.controller";
import { borrowRoutes } from "./app/controllers/borrow.controller";
import { globalErrorHandler } from "./app/config/globalErrorHandler";
import cors from "cors";
import { ApiError } from "./app/config/ApiError";
import { notFound } from "./app/middlewares/noteFound";

const app: Application = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

app.use(express.json());

app.use("/api/books", booksRoutes);
app.use("/api/borrow", borrowRoutes);

app.use(notFound);
app.use(globalErrorHandler);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Book Store App");
});

export default app;
