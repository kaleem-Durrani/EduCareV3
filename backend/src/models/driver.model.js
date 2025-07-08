import mongoose from "mongoose";
import { Schema } from "mongoose";

// Driver Schema for transportation management
const driverSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    licenseNumber: { type: String, required: true, unique: true },
    photoUrl: { type: String }, // Driver's photo
    vehicle: {
      make: { type: String, required: true }, // e.g., Toyota
      model: { type: String, required: true }, // e.g., Hiace
      year: { type: Number },
      plateNumber: { type: String, required: true, unique: true },
      color: { type: String },
      capacity: { type: Number, required: true }, // Number of students
      photoUrl: { type: String }, // Vehicle photo
    },
    route: {
      name: { type: String, required: true }, // e.g., "Route A", "North Route"
      description: { type: String },
      stops: [
        {
          name: { type: String, required: true }, // Stop name
          address: { type: String },
          coordinates: {
            latitude: { type: Number },
            longitude: { type: Number },
          },
          estimatedTime: { type: String }, // e.g., "08:15 AM"
          order: { type: Number, required: true }, // Stop order in route
        },
      ],
    },
    schedule: {
      pickupTime: { type: String, required: true }, // e.g., "07:30 AM"
      dropoffTime: { type: String, required: true }, // e.g., "12:45 PM"
      workingDays: [{ type: String }], // e.g., ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    },
    assignedStudents: [
      {
        student_id: { type: Schema.Types.ObjectId, ref: "Student", required: true },
        pickupStop: { type: String, required: true }, // Which stop the student gets picked up
        dropoffStop: { type: String, required: true }, // Which stop the student gets dropped off
        active: { type: Boolean, default: true },
        assignedDate: { type: Date, default: Date.now },
      },
    ],
    emergencyContact: {
      name: { type: String },
      phone: { type: String },
      relationship: { type: String }, // e.g., "Supervisor", "Manager"
    },
    status: {
      type: String,
      enum: ["active", "inactive", "maintenance"],
      default: "active",
    },
    notes: { type: String }, // Additional notes about the driver or route
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }, // Admin who created this
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" }, // Last admin who updated this
  },
  { timestamps: true }
);

// Index for efficient queries
driverSchema.index({ "assignedStudents.student_id": 1 });
driverSchema.index({ status: 1 });
driverSchema.index({ "route.name": 1 });

const Driver = mongoose.model("Driver", driverSchema);

export default Driver;
