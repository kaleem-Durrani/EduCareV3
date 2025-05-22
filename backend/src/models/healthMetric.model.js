import mongoose from "mongoose";
import { Schema } from "mongoose";

// 16. HealthMetric Schema
const healthMetricSchema = new Schema(
  {
    student_id: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    type: { type: String, enum: ["height", "weight"], required: true },
    value: { type: Number, required: true }, // e.g., cm for height, kg for weight
    label: { type: String }, // For chart labels, e.g., 'Day 1', 'Week 5', 'Jan'
    date: { type: Date, required: true }, // Date of measurement
    notes: { type: String },
    recordedBy: { type: Schema.Types.ObjectId, ref: "User" }, // Admin/Teacher
  },
  { timestamps: true }
);
healthMetricSchema.index({ student_id: 1, date: -1 });

const HealthMetric = mongoose.model("HealthMetric", healthMetricSchema);

export default HealthMetric;
