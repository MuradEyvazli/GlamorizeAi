// models/subscription.js
import mongoose, { Schema, models } from "mongoose";

const subscriptionSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  creditspermonth: {
    type: Number,
    required: true
  },
  allowedRequests: {
    type: Number,
    required: true,
    default: 0
  },
  yearlyPrice: {
    type: Number
  },
  // Bu alanları zorunlu olmaktan çıkarın
  type: {
    type: String,
    default: "monthly" // Varsayılan bir değer atayın
  },
  details: {
    type: String,
    default: "" // Boş bir string varsayılan olarak ayarlayın
  }
}, { timestamps: true });

const Subscription = models.Subscription || mongoose.model('Subscription', subscriptionSchema);

export default Subscription;