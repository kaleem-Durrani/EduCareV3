import mongoose from "mongoose";
import { Schema } from "mongoose";

// 14. Activity Schema (For "Activities" Calendar)
const activitySchema = new Schema(
  {
    month: { type: String, required: true }, // e.g., "January"
    date: { type: String, required: true }, // e.g., "15"
    day: { type: String, required: true }, // e.g., "Monday"
    title: { type: String, required: true },
    description: { type: String, required: true },
    dayColor: { type: String }, // Color for the calendar entry
    iconUrl: { type: String }, // For activity icon [cite: 6]
    class_id: { type: Schema.Types.ObjectId, ref: "Class" }, // Link to a class if class-specific
    // Based on feedback, audience might be needed here too [cite: 12]
    audience: {
      type: { type: String, enum: ["all", "class"], default: "all" }, // [cite: 10]
      class_id: { type: Schema.Types.ObjectId, ref: "Class" }, // if audience.type is 'class'
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }, // Admin
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
activitySchema.index({ date: 1 }); // Assuming 'date' can be made into a sortable format

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
