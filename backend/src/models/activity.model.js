import mongoose from "mongoose";
import { Schema } from "mongoose";

// 14. Activity Schema (For "Activities" Calendar)
const activitySchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true }, // Full date for proper sorting and querying
    color: { type: String, default: "#3B82F6" }, // Color for the calendar icon (hex color)

    // Audience configuration - supports all students, single class, or individual student
    audience: {
      type: {
        type: String,
        enum: ["all", "class", "student"],
        required: true,
        default: "all"
      },
      class_id: {
        type: Schema.Types.ObjectId,
        ref: "Class",
        required: function() { return this.audience.type === "class"; }
      },
      student_id: {
        type: Schema.Types.ObjectId,
        ref: "Student",
        required: function() { return this.audience.type === "student"; }
      }
    },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Teacher or Admin
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Indexes for efficient querying
activitySchema.index({ date: 1 });
activitySchema.index({ "audience.type": 1 });
activitySchema.index({ "audience.class_id": 1 });
activitySchema.index({ "audience.student_id": 1 });
activitySchema.index({ createdBy: 1 });

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
