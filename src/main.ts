import mongoose from "mongoose";
import { app } from "./app";

mongoose.set("strictQuery", false);

// Start Chatr
const start = async () => {
  if (!process.env.MONGO_URI) throw new Error("Mongo_URI is required");
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is required");
  try {
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(8000, () =>
      console.log("Server is up and running on port 8000")
    );
  } catch (err) {
    throw new Error("database Error");
  }
};

start();
