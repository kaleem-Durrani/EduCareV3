import mongoose from "mongoose";
import { Schema } from "mongoose";

// 20. Note Schema (For "Notes" module) [cite: 6]
const noteSchema = new Schema(
  {
    student_id: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    content: { type: String, required: true },
    // date: { type: Date, default: Date.now }, // Implied by timestamps
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }, // Teacher or Admin [cite: 6]
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
noteSchema.index({ student_id: 1, createdAt: -1 });

const Note = mongoose.model("Note", noteSchema);

export default Note;
