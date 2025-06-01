import mongoose from "mongoose";
import { Schema } from "mongoose";

// 10. StudentBoxStatus Schema
const studentBoxItemStatusSchema = new Schema(
  {
    item_id: { type: Schema.Types.ObjectId, ref: "BoxItem", required: true },
    has_item: { type: Boolean, required: true, default: false },
    notes: { type: String, default: "" },
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
    items: [studentBoxItemStatusSchema], // Array of item statuses
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" }, // Teacher who updated status
  },
  { timestamps: true }
);

const StudentBoxStatus = mongoose.model(
  "StudentBoxStatus",
  studentBoxStatusSchema
);

export default StudentBoxStatus;
