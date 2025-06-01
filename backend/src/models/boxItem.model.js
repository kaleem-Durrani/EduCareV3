import mongoose from "mongoose";
import { Schema } from "mongoose";

// 9. BoxItem Schema (Master list of possible items for "My Box")
const boxItemSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "" }, // Description for the item
    defaultInStock: { type: Boolean, default: false }, // From the new GET /api/box/items logic
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }, // Admin/Teacher who added this item type
  },
  { timestamps: true }
);

const BoxItem = mongoose.model("BoxItem", boxItemSchema);

export default BoxItem;
