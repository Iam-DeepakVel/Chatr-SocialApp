import { BadRequestError } from "../../../common"
import { Router, Request, Response, NextFunction } from "express";
import Post from "../../models/post";

const router = Router();

router.post(
  "/post/:id/delete/images",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { imagesIds } = req.body;
    if (!req.files) return next(new BadRequestError("images are required"));
   
    // Removing images from posts
    const post = await Post.findOneAndUpdate(
      { _id: id },
      {
        $pull: { images: { _id: { $in: imagesIds } } },
      },
      { new: true }
    );

    res.status(200).send(post);
  }
);

export { router as deleteImagesRouter };
