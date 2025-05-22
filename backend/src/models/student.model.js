import mongoose from "mongoose";
import { Schema } from "mongoose";

const studentSchema = new Schema(
  {
    fullName: { type: String, required: true },
    class: { type: String, required: true }, // Could also be a reference if classes have fixed names/grades that are not just strings
    rollNum: { type: Number, unique: true }, // As per the feedback "Enrollment #" [cite: 12]
    birthdate: { type: Date, required: true },
    schedule: {
      time: { type: String, default: "08:00 - 12:30" },
      days: { type: String, default: "Monday to Friday" },
    },
    allergies: [{ type: String }],
    likes: [{ type: String }],
    additionalInfo: { type: String },
    authorizedPhotos: { type: Boolean, default: false },
    photoUrl: { type: String }, // URL to student's photo
    contacts: [
      {
        // For family members [cite: 6, 12]
        relationship: { type: String, required: true }, // e.g., Mom, Dad [cite: 12]
        name: { type: String, required: true },
        phone: { type: String }, // For calls and WhatsApp [cite: 6]
        photoUrl: { type: String }, // Photo of family member [cite: 12]
      },
    ],
    current_class: { type: Schema.Types.ObjectId, ref: "Class" }, // Reference to Class schema
    current_academic_year: { type: String },
    active: { type: Boolean, default: true }, // If student is currently active in school
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;
