import express, { Request, Response } from "express";
import { Borrow } from "../models/borrow.model";

export const borrowRoutes = express.Router();

borrowRoutes.post("/", async (req: Request, res: Response) => {
  const body = req.body;
  const data = await Borrow.create(body);

  res.status(200).json({
    success: true,
    message: "Book borrowed successfully",
    data,
  });
});

borrowRoutes.get("/", async (req: Request, res: Response) => {
  const data = await Borrow.find();

  res.status(200).json({
    success: true,
    message: "Borrow records fetched successfully",
    data,
  });
});
