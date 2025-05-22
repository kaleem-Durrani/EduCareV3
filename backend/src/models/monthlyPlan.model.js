import mongoose from "mongoose";
import { Schema } from "mongoose";

// 8. MonthlyPlan Schema
const monthlyPlanActivitySchema = new Schema(
  {
    date: { type: String }, // Original schema, feedback for admin says remove [cite: 12]
    title: { type: String }, // Original schema, feedback for admin says remove [cite: 12]
    description: { type: String, required: true }, // Text content for yellow box [cite: 12]
    goals: [{ type: String }], // Original schema, feedback for admin says remove [cite: 12]
  },
  { _id: false }
);

const monthlyPlanSchema = new Schema(
  {
    month: { type: Number, required: true, min: 1, max: 12 }, // Feedback: "Month in text (march)" - store as number, format in frontend [cite: 12]
    year: { type: Number, required: true },
    class_id: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    // activities: [monthlyPlanActivitySchema], // Original structure
    description: { type: String, required: true }, // Main text content as per feedback [cite: 12]
    imageUrl: { type: String }, // Image for the plan [cite: 12]
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }, // Admin or Teacher
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
monthlyPlanSchema.index({ month: 1, year: 1, class_id: 1 }, { unique: true });

const MonthlyPlan = mongoose.model("MonthlyPlan", monthlyPlanSchema);

export default MonthlyPlan;
