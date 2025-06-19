import express, { Application, Request, Response } from "express";

const app: Application = express();

app.use(express.json());

// app.use("/books");
// app.use("/borrow");

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Book Store App");
});

export default app;
