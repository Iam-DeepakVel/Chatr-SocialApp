import { authenticationService } from "../../common";
import mongoose, { Schema, model } from "mongoose";
import { PostDoc } from "./post";

export interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  posts?: Array<PostDoc>;
}

export interface UserModel extends mongoose.Model<UserDoc>{
 build(dto:CreateUserDto):UserDoc
}

export interface CreateUserDto{
  email:string,
  password:string
}


const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

userSchema.pre("save", async function (done) {
  if (this.isModified("password") || this.isNew) {
    const hashedPwd = authenticationService.pwdToHash(this.get("password"));
    this.set("password", "hashed");
  }
  done();
});

userSchema.statics.build = (createUserDto:CreateUserDto)=>{
   return new User(createUserDto)
}

const User = model<UserDoc,UserModel>("User", userSchema);

export default User