import mongoose, { Schema } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  password: string;
  displayName: string;
  avatar: string;
  role: "user" | "admin";
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      lowercase: true,
      unique: true,
      minlength: 3,
      maxlength: 30,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },

    displayName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
      default: "",
    },

    avatar: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
