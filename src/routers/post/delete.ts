import { NextFunction, Request, Response, Router } from "express";
import Post from "../../models/post";
import User, { UserDoc } from "../../models/user";
const router = Router();
import { BadRequestError } from "../../../common";

router.delete(
  "/api/post/delete/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      return next(new BadRequestError("post id not found"));
    }

    try {
      await Post.findOneAndRemove({ _id: id });
    } catch (error) {
      next(new Error("post cannot be deleted")); //Passing error to Error Handler and from there it will be passed to Client
    }
    const user = await User.findOneAndUpdate(
      { _id: req.currentUser!.userId },
      {
        $pull: { posts: id },
      },
      { new: true }
    );
    if (!user) return next(new Error());
    res.status(200).send(user);
  }
);

export { router as deletePostRouter };
