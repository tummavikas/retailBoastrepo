import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const adminSchema = new mongoose.Schema({
  adminId: {
    type: String,
    default: uuidv4,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  shopName: {
    type: String,
    required: true
  },
  shopType: {
    type: String,
    required: true,
    enum: ['kirana', 'gym', 'shopping', 'other']
  },
  establishmentDate: {
    type: Date,
    required: true
  },
  dailyCustomers: {
    type: Number,
    required: true
  },
  avgSpending: {
    type: Number,
    required: true
  },
  expectedPeople: {
    type: Number,
    required: true
  },
  minCartValue: {
    type: Number,
    default: 100
  },
  discounts: {
    tenPercent: { 
      type: Number, 
      default: 0,
      required: true 
    },
    twentyPercent: {
      count: { 
        type: Number, 
        default: 0,
        required: true 
      },
      minPurchase: { 
        type: Number, 
        default: 0,
        required: true 
      }
    },
    thirtyPercent: {
      count: { 
        type: Number, 
        default: 0,
        required: true 
      },
      minPurchase: { 
        type: Number, 
        default: 0,
        required: true 
      }
    },
    fiftyPercent: {
      count: { 
        type: Number, 
        default: 0,
        required: true 
      },
      minPurchase: { 
        type: Number, 
        default: 0,
        required: true 
      }
    }
  },
  role: {
    type: String,
    default: "admin",
    enum: ["admin"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);
export default Admin;
