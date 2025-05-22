import mongoose from "mongoose";
import { Schema } from "mongoose";

// 7. WeeklyReport Schema
const dailyReportItemSchema = new Schema(
  {
    day: { type: String, required: true, enum: ["M", "T", "W", "Th", "F"] }, // Changed to single letter [cite: 12]
    // Fields changed based on feedback [cite: 12]
    toilet: { type: String }, // Was 'pee'
    food_intake: { type: String }, // Was 'poop' (assuming "Food" from feedback refers to food intake)
    friends_interaction: { type: String }, // Was 'food'
    studies_mood: { type: String }, // Was 'mood'
  },
  { _id: false }
);

const weeklyReportSchema = new Schema(
  {
    student_id: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    weekStart: { type: Date, required: true },
    weekEnd: { type: Date, required: true },
    dailyReports: [dailyReportItemSchema],
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }, // Teacher or Admin
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
weeklyReportSchema.index({ student_id: 1, weekStart: 1 }, { unique: true });

const WeeklyReport = mongoose.model("WeeklyReport", weeklyReportSchema);

export default WeeklyReport;
