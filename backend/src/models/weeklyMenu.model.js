import mongoose from "mongoose";
import { Schema } from "mongoose";

const weeklyMenuSchema = new Schema(
  {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    menuData: [
      {
        // Array of daily menus
        day: {
          type: String,
          required: true,
          enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        }, // Kindergarten closed Sat/Sun [cite: 12]
        items: [{ type: String }], // e.g., ["Spaghetti Bolognese", "Salad", "Fruit"]
      },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
weeklyMenuSchema.index({ startDate: 1, endDate: 1 }, { unique: true });

const WeeklyMenu = mongoose.model("WeeklyMenu", weeklyMenuSchema);

export default WeeklyMenu;
