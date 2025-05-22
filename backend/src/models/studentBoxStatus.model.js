import mongoose from "mongoose";
import { Schema } from "mongoose";

// 10. StudentBoxStatus Schema
const studentBoxItemStatusSchema = new Schema(
  {
    item_id: { type: Schema.Types.ObjectId, ref: "BoxItem", required: true },
    inStock: { type: Boolean, required: true },
  },
  { _id: false }
);

const studentBoxStatusSchema = new Schema(
  {
    student_id: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      unique: true,
    },
    items: { type: Map, of: Boolean }, // Map where key is BoxItem._id (string) and value is boolean (inStock)
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" }, // Teacher who updated status
  },
  { timestamps: true }
);

const StudentBoxStatus = mongoose.model(
  "StudentBoxStatus",
  studentBoxStatusSchema
);

export default StudentBoxStatus;
