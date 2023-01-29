import { NextFunction, Request, Response, Router } from "express";
import Post from "../../models/post";
import { BadRequestError } from "../../../common";

const router = Router();
router.post(
  "/api/post/update/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { content, title } = req.body;
    if (!id) {
      return next(new BadRequestError("post id is required!"));
    }
    let updatedPost;

    try {
      //  new:true gives us new updated document
      updatedPost = await Post.findOneAndUpdate(
        { _id: id },
        {
          $set: { content, title },
        },
        {
          new: true,
        }
      );
    } catch (err) {
      return next(new BadRequestError("post cannot be updated!")); //Passing error to Error Handler and from there it will be passed to Client
    }
    res.status(200).send(updatedPost);
  }
);

export { router as updatePostRouter };
