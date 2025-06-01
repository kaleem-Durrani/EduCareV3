import mongoose from "mongoose";
import { Schema } from "mongoose";

// 11. DocumentType Schema (Master list for "My Documents")
const documentTypeSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "" }, // Description for the document type
    required: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }, // Admin who added this document type
  },
  { timestamps: true }
);

const DocumentType = mongoose.model("DocumentType", documentTypeSchema);

export default DocumentType;
