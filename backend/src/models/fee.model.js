import mongoose from "mongoose";
import { Schema } from "mongoose";

// 18. Fee Schema
const feeSchema = new Schema(
  {
    student_id: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    deadline: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Unpaid", "In Progress", "Paid"],
      default: "Unpaid",
    },
    // The Python code sets status to 'Paid' by default on creation, which is unusual for a new fee.
    // Feedback mentions notification to parent when status is UNPAID. [cite: 12]
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }, // Admin or Teacher
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
feeSchema.index({ student_id: 1, deadline: 1 });

const Fee = mongoose.model("Fee", feeSchema);

export default Fee;
