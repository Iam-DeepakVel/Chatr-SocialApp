import { NextFunction, Request, Response, Router } from "express";
import Post from "../../models/post";
const router = Router();
import Comment from "../../models/comment";
import { BadRequestError } from "../../../common";

router.post(
  "/api/comment/new/:postId",
  async (req: Request, res: Response, next: NextFunction) => {
    const { userName, content } = req.body;
    const { postId } = req.params;

    if (!content) {
      return next(new BadRequestError("content is required")); //Passing error to Error Handler and from there it will be passed to Client
    }

    const newComment = Comment.build({
      userName: userName ? userName : "anonymous",
      content,
    });
    await newComment.save();

    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId },
      { $push: { comments: newComment } },
      { new: true }
    );

    res.status(201).send(updatedPost);
  }
);

export { router as newCommentRouter };
