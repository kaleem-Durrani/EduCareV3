import mongoose from "mongoose";
import { Schema } from "mongoose";

const parentStudentRelationSchema = new Schema(
  {
    parent_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    student_id: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    relationshipType: { type: String, default: "parent" }, // e.g., parent, guardian
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);
parentStudentRelationSchema.index(
  { parent_id: 1, student_id: 1 },
  { unique: true }
);

const ParentStudentRelation = mongoose.model(
  "ParentStudentRelation",
  parentStudentRelationSchema
);

export default ParentStudentRelation;
