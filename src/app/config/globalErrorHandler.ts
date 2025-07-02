// middlewares/globalErrorHandler.ts
import { ZodError } from "zod";
import { ErrorRequestHandler } from "express";
import { ApiError } from "./ApiError";

export const globalErrorHandler = (
  err: any,
  req: any,
  res: any,
  next: any
): void => {
  if (err instanceof ZodError) {
    const formattedErrors: Record<string, any> = {};

    err.errors.forEach((issue) => {
      const field = issue.path[0];
      const value = req.body?.[field];

      formattedErrors[field] = {
        message: issue.message,
        name: "ValidatorError",
        properties: {
          message: issue.message,
          type: issue.code === "too_small" ? "min" : issue.code,
          ...(issue.code === "too_small" && issue.minimum !== undefined
            ? { min: issue.minimum }
            : {}),
        },
        kind: issue.code === "too_small" ? "min" : issue.code,
        path: field,
        value,
      };
    });

    return res.status(400).json({
      message: "Validation failed",
      success: false,
      error: {
        name: "ValidationError",
        errors: formattedErrors,
      },
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: {
        name: err.name,
        stack: err.stack,
      },
    });
  }

  if (err.status === 404 || err.message === "Not Found") {
    return res.status(404).json({
      success: false,
      message: "API not found",
      error: {
        name: "NotFoundError",
      },
    });
  }

  return res.status(500).json({
    message: err.message || "Something went wrong",
    success: false,
    error: {
      name: err.name || "InternalServerError",
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    },
  });
};
