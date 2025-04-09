import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  adminId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String
  },
  amount: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    required: true
  },
  finalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  // Explicitly disable any automatic validation for unknown fields
  strict: true,
  strictQuery: false
});

export default mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);
