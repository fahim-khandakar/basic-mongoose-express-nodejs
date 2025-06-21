import { ZodError } from "zod";
import { ErrorRequestHandler } from "express";

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
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

    res.status(400).json({
      message: "Validation failed",
      success: false,
      error: {
        name: "ValidationError",
        errors: formattedErrors,
      },
    });
    return;
  }

  // fallback
  res.status(500).json({
    message: err.message || "Something went wrong",
    success: false,
    error: err,
  });
  return;
};
