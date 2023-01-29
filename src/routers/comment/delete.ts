import { BadRequestError } from "../../../common";
import { NextFunction, Request, Response, Router } from "express";
import Comment from "../../models/comment";
import Post from "../../models/post";

const router = Router();

router.delete(
  "/api/comment/:commentId/delete/:postId",
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId, commentId } = req.params;
    // Handling inputs and throwing error incase of missing inpus
    if (!commentId || !postId) {
      // !Creating instance of BadRequestError and passing it to next
      return next(
        new BadRequestError("Comment id and comment id are both required")
      );
    }

    // Removing comment by using commentId
    try {
      await Comment.findOneAndRemove({ _id: commentId });
    } catch (error) {
      next(new Error("comment cannot be updated")); //Passing error to Error Handler and from there it will be passed to Client
    }

    // Updating Posts after removing comment from that post
    const post = await Post.findOneAndUpdate(
      { _id: postId },
      {
        $pull: { comments: commentId },
      },
      //* To return new updated document
      { new: true }
    );

    if (!post) return next(new Error());

    // Finally, Sending response as success:true
    res.status(200).json(post);
  }
);

export { router as deleteCommentRouter };
