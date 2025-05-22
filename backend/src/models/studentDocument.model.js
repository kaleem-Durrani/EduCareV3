import mongoose from "mongoose";
import { Schema } from "mongoose";

// 12. StudentDocument Schema
const studentDocumentItemSchema = new Schema(
  {
    doc_type_id: {
      type: Schema.Types.ObjectId,
      ref: "DocumentType",
      required: true,
    },
    onFile: { type: Boolean, default: false },
    verificationDate: { type: Date },
    verifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
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
    documents: {
      type: Map,
      of: new Schema(
        {
          // Key is DocumentType._id (string)
          onFile: { type: Boolean, default: false },
          verificationDate: { type: Date },
          verifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
        },
        { _id: false }
      ),
    },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" }, // Admin who updated status
  },
  { timestamps: true }
);

const StudentDocument = mongoose.model(
  "StudentDocument",
  studentDocumentSchema
);

export default StudentDocument;
