import { NextFunction, Request, Response, Router } from "express";
import User from "../../models/user";
const router = Router();
import { authenticationService, BadRequestError } from "../../../common";
import jwt from "jsonwebtoken";

router.post(
  "/signin",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(new BadRequestError("Invalid Credentials"));
    }

    const isEqual = await authenticationService.pwdCompare(
      user.password,
      password
    );

    if (!isEqual) {
      return next(new BadRequestError("Invalid Credentials"));
    }

    // * During signin - jwt token added in req.session
    const token = jwt.sign(
      { email, userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: 300 }
    );
    req.session = { jwt: token };

    res.status(200).send(user);
  }
);

export { router as signinRouter };
