import express, { Request, Response } from "express";

export const borrowRoutes = express.Router();

borrowRoutes.post("/create-borrow", async (req: Request, res: Response) => {
  res.status(201).json({
    success: true,
    message: "Note created successfully",
  });
});
borrowRoutes.get("/", async (req: Request, res: Response) => {
  res.status(201).json({
    success: true,
    message: "Borrow records fetched successfully",
  });
});
