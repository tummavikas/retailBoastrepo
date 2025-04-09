import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  merchantAdminId: { type: String, required: true },
  upiId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED'], default: 'PENDING' },
  upiTxnId: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.PaymentTransaction || mongoose.model('PaymentTransaction', TransactionSchema);