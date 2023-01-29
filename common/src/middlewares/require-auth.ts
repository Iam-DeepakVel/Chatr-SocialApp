// To check for authentication
import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../../../common";

// *Checking whether currenUser property is present in req or not
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    return next(new NotAuthorizedError());
  }
  next();
};
