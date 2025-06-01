import mongoose from "mongoose";
import { Schema } from "mongoose";

// 12. StudentDocument Schema
const studentDocumentItemSchema = new Schema(
  {
    document_type_id: {
      type: Schema.Types.ObjectId,
      ref: "DocumentType",
      required: true,
    },
    submitted: { type: Boolean, default: false },
    submission_date: { type: Date },
    notes: { type: String, default: "" },
  },
  { _id: false }
);

const studentDocumentSchema = new Schema(
  {
    student_id: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      unique: true,
    },
    documents: [studentDocumentItemSchema], // Array of document statuses
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" }, // Admin who updated status
  },
  { timestamps: true }
);

const StudentDocument = mongoose.model(
  "StudentDocument",
  studentDocumentSchema
);

export default StudentDocument;
