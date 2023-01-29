import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ errors: err.generateErrors() });
  }
  
  // When we didn't get the status code this will be sent to client
  res.status(500).json({ errors: [{ message: "something went wrong" }] });
};
