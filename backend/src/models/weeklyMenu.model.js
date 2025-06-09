import mongoose from "mongoose";
import { Schema } from "mongoose";

const weeklyMenuSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "draft",
    },
    menuData: [
      {
        // Array of daily menus
        day: {
          type: String,
          required: true,
          enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        }, // Kindergarten closed Sat/Sun
        items: [
          {
            type: String,
            trim: true,
            maxlength: 100,
          },
        ], // e.g., ["Spaghetti Bolognese", "Salad", "Fruit"]
      },
    ],
    totalItems: { type: Number, default: 0 }, // Calculated field for statistics
    isActive: { type: Boolean, default: false }, // Only one menu can be active at a time
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Indexes for better performance
weeklyMenuSchema.index({ startDate: 1, endDate: 1 });
weeklyMenuSchema.index({ status: 1 });
weeklyMenuSchema.index({ isActive: 1 });
weeklyMenuSchema.index({ createdAt: -1 });

// Pre-save middleware to calculate totalItems
weeklyMenuSchema.pre("save", function (next) {
  if (this.menuData && Array.isArray(this.menuData)) {
    this.totalItems = this.menuData.reduce(
      (sum, day) => sum + (day.items?.length || 0),
      0
    );
  }
  next();
});

const WeeklyMenu = mongoose.model("WeeklyMenu", weeklyMenuSchema);

export default WeeklyMenu;
