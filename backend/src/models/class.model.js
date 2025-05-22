import mongoose from "mongoose";
import { Schema } from "mongoose";

const classSchema = new Schema(
  {
    name: { type: String, required: true }, // e.g., "Red Class", "Blue Class" [cite: 12]
    grade: { type: String }, // Original schema had this, feedback suggests removing for creation [cite: 12]
    section: { type: String }, // Original schema had this, feedback suggests removing for creation [cite: 12]
    academic_year: { type: String }, // Original schema had this, feedback suggests removing for creation [cite: 12]
    description: { type: String }, // As per feedback for "Create new class" [cite: 12]
    teachers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    students: [{ type: Schema.Types.ObjectId, ref: "Student" }], // From original code, holds student ObjectIds
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Class = mongoose.model("Class", classSchema);

export default Class;
