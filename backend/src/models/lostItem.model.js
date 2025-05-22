import mongoose from "mongoose";
import { Schema } from "mongoose";

// 15. LostItem Schema
const lostItemSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    dateFound: { type: Date, required: true }, // Changed from String to Date for better querying
    imagePath: { type: String }, // Storing path relative to UPLOAD_FOLDER or full URL if using cloud storage
    status: {
      type: String,
      enum: ["unclaimed", "claimed"],
      default: "unclaimed",
    },
    claimedBy: { type: Schema.Types.ObjectId, ref: "User" }, // Parent who claimed
    claimedDate: { type: Date },
  },
  { timestamps: true }
);
lostItemSchema.index({ dateFound: -1 });

const LostItem = mongoose.model("LostItem", lostItemSchema);

export default LostItem;
