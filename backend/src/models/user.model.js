import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password_hash: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["parent", "teacher", "admin"],
    },
    name: { type: String }, // Used for teachers, potentially parents/admins too
    phone: { type: String },
    address: { type: String },
    photoUrl: { type: String }, // For teacher profile image on Wall [cite: 6]
    is_active: { type: Boolean, default: true },
    // For forgot password functionality
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
