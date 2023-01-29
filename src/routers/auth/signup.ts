import { NextFunction, Request, Response, Router } from "express";
import User from "../../models/user";
const router = Router();
import jwt from "jsonwebtoken";
import { BadRequestError, validationRequest} from "../../../common";
import { body } from "express-validator";

router.post(
  "/signup",
  [
    body("email")
      .not()
      .isEmpty()
      .isEmail()
      .withMessage("a valid email is required"),
    body("password")
      .not()
      .isEmpty()
      .isLength({ min: 6 })
      .withMessage("a valid password is required"),
  ],validationRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return next(new BadRequestError("User already Exists"));
    }
    const newUser = User.build({
      email,
      password,
    });
    await newUser.save();

    // * During creating new account also jwt token added in req.session
    req.session = {
      jwt: jwt.sign({ email, userId: newUser._id }, process.env.JWT_SECRET!, {
        expiresIn: 300,
      }),
    };

    res.status(201).send(newUser);
  }
);

export { router as signupRouter };
