import mongoose from "mongoose";
import { Schema } from "mongoose";

// 19. FeeTransaction Schema (To log payments)
const feeTransactionSchema = new Schema(
  {
    fee_id: { type: Schema.Types.ObjectId, ref: "Fee", required: true },
    student_id: { type: Schema.Types.ObjectId, ref: "Student", required: true }, // Denormalized for easier lookup
    amount: { type: Number, required: true }, // Amount paid in this transaction
    transactionDate: { type: Date, default: Date.now },
    paymentMethod: { type: String }, // e.g., 'Cash', 'Card', 'Online'
    processedBy: { type: Schema.Types.ObjectId, ref: "User" }, // User who processed the payment
  },
  { timestamps: true }
);
feeTransactionSchema.index({ fee_id: 1 });
feeTransactionSchema.index({ student_id: 1 });
feeTransactionSchema.index({ transactionDate: 1 });

const FeeTransaction = mongoose.model("FeeTransaction", feeTransactionSchema);

export default FeeTransaction;
