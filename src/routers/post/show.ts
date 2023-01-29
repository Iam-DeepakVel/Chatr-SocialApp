import { NextFunction, Request, Response, Router } from "express";
const router = Router();
import Post from "../../models/post";


router.post(
  "/api/post/show",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.body;
    if (!id) {
      const allPosts = await Post.find({}).populate("comments");
      return res.status(200).send(allPosts);
    }
    const post = await Post.findOne({ _id: id }).populate("comments");
    res.status(200).send(post);
  }
);

export { router as showPostRouter };
