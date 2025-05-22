import mongoose from "mongoose";
import { Schema } from "mongoose";

const studentClassHistorySchema = new Schema(
  {
    student_id: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    class_id: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    academic_year: { type: String, required: true },
    enrollment_date: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["active", "transferred", "withdrawn"],
      default: "active",
    },
    enrolled_by: { type: Schema.Types.ObjectId, ref: "User" },
    transfer_date: { type: Date },
    transfer_reason: { type: String },
    transferred_from: { type: Schema.Types.ObjectId, ref: "Class" },
    withdrawal_date: { type: Date },
    withdrawal_reason: { type: String },
    withdrawn_by: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
studentClassHistorySchema.index(
  { student_id: 1, academic_year: 1 },
  { unique: true, partialFilterExpression: { status: "active" } }
); // A student can only be active in one class per year.

const StudentClassHistory = mongoose.model(
  "StudentClassHistory",
  studentClassHistorySchema
);

export default StudentClassHistory;
