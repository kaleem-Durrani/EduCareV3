import mongoose from "mongoose";
import { Schema } from "mongoose";

// 17. HealthInfo Schema (General health details, as per GET /api/health/info/:student_id)
const healthInfoSchema = new Schema(
  {
    student_id: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      unique: true,
    },
    blood_group: { type: String },
    allergy: { type: String }, // This seems redundant with Student.allergies, decide on single source of truth
    eye_condition: { type: String },
    heart_rate: { type: String }, // Could be number range
    ear_condition: { type: String },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const HealthInfo = mongoose.model("HealthInfo", healthInfoSchema);

export default HealthInfo;
