import * as dotenv from "dotenv"
import express from "express";
import { json, urlencoded } from "body-parser";
import cors from "cors";
import {
  newPostRouter,
  deletePostRouter,
  showPostRouter,
  updatePostRouter,
  newCommentRouter,
  deleteCommentRouter,
  signupRouter,
  signinRouter,
  signoutRouter,
  currentUserRouter,
  addImagesRouter,
  deleteImagesRouter
} from "./routers";
import cookieSession from "cookie-session";
import {
  currentUser,
  errorHandler,
  NotFoundError,
  requireAuth,
} from "../common";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200,
  })
);

app.set("trust proxy", true);


//Note: app.use(express.json()) - No need of body-parser as separate package
app.use(
  urlencoded({
    extended: false,
  })
);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

// !"CurrentUser" middleware executes first so that "requireAuth" middleware gets currentUser value
app.use(currentUser);

// !Using middleware "requireAuth" is to check whether jwt is there are not i.e user logged in or not

app.use(currentUserRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);

// Post Routers
app.use(requireAuth, newPostRouter);
app.use(requireAuth, updatePostRouter);
app.use(requireAuth, deletePostRouter);
app.use(requireAuth, addImagesRouter);
app.use(requireAuth, deleteImagesRouter);
app.use(showPostRouter);

// Comment Routers
app.use(requireAuth, newCommentRouter);
app.use(requireAuth, deleteCommentRouter);

app.all("*", (req, res, next) => {
  //* Creating new instance of NotFoundError and passing the value to error-handler middleware
  return next(new NotFoundError());
});

// Error-Handling Middleware
app.use(errorHandler);

export {app}