import { NextFunction, Request, Response } from "express";
import { ApiError } from "../config/ApiError";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, "API not found"));
};
