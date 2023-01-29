import { Router, Request, Response, NextFunction } from "express";
import Post from "../../models/post";
import User from "../../models/user";
import {
  BadRequestError,
  uploadImages,
  validationRequest,
} from "../../../common";
import fs from "fs";
import path from "path";
import { body } from "express-validator";

const router = Router();

router.post(
  "/api/post/new",
  [
    body("title").not().isEmpty().withMessage("a valid title is required"),
    body("content")
      .not()
      .isEmpty()
      .isLength({ min: 6 })
      .withMessage("a valid password is required"),
  ],
  validationRequest,
  uploadImages,
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, content } = req.body;

    if (!req.files) return next(new BadRequestError("images are required"));

    let images: Array<Express.Multer.File>;
    if (typeof req.files === "object") {
      images = Object.values(req.files);
    } else {
      images = req.files ? [...req.files] : [];
    }
    if (!title || !content) {
      return next(new BadRequestError("title and content are required"));
      //Passing error to Error Handler and from there it will be passed to Client
    }

    const newPost = Post.build({
      title,
      content,
      images: images.map((file: Express.Multer.File) => {
        let srcObj = {
          src: `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
        };
        fs.unlink(path.join("upload" + file.filename), () => {});
        return srcObj;
      }),
    });
    await newPost.save();

    // Saving the post in currentUser Posts
    await User.findOneAndUpdate(
      { _id: req.currentUser!.userId },
      {
        $push: { posts: newPost._id },
      }
    );
    res.status(201).send(newPost);
  }
);

export { router as newPostRouter };
