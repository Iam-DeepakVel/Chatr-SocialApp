import { NextFunction, Request, Response, Router } from "express";
const router = Router();

import { currentUser } from "../../../common";

router.get(
  "/current-user",
  currentUser,
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({ currentUser: req.currentUser });
  }
);


export { router as currentUserRouter };
