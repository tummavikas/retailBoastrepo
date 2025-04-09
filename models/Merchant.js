import mongoose from 'mongoose';
import encrypt from 'mongoose-encryption';

const MerchantSchema = new mongoose.Schema({
  adminId: { type: String, required: true, unique: true },
  name: String,
  upiId: { type: String, required: true },
});

MerchantSchema.plugin(encrypt, {
  secret: process.env.ENCRYPTION_KEY,
  encryptedFields: ['upiId'],
});

export default mongoose.models.Merchant || mongoose.model('Merchant', MerchantSchema);
