import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// ! ts configurations
declare global {
  interface JwtPayload {
    email: string;
    userId: string;
  }
  //* Adding currentUser property to Request
  namespace Express {
    interface Request {
      currentUser?: JwtPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }
  try {
    // * payload has - {email:string,password:string}
    const payload = jwt.verify(
      req.session?.jwt,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    //store payload in req.currentUser - Setup ts configurations to make it work
    req.currentUser = payload;
  } catch (err) {
    return next(err);
  }
  next();
};
