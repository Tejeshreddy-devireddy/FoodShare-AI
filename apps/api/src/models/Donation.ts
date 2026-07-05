import mongoose, { Schema, model } from 'mongoose';
import { MockModel } from './mockDb';

const FoodItemSchema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, enum: ['kg', 'liters', 'servings', 'units'], default: 'servings' },
  foodType: { type: String, enum: ['veg', 'non-veg', 'bakery', 'dry', 'cooked', 'beverage'], required: true }
});

const DonationSchema = new Schema({
  donor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  foodItems: [FoodItemSchema],
  freshnessScore: { type: Number, default: 100 },
  shelfLifeHours: { type: Number, default: 24 },
  images: [{ type: String }],
  description: { type: String },
  expiryTime: { type: Date, required: true },
  pickupWindowStart: { type: Date, required: true },
  pickupWindowEnd: { type: Date, required: true },
  status: {
    type: String,
    enum: ['available', 'matched', 'claimed', 'picked_up', 'completed', 'cancelled'],
    default: 'available',
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  address: { type: String },
  matchedNgo: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  qrCodeHash: { type: String, default: null },
  carbonSavedCalculation: { type: Number, default: 0 },
}, {
  timestamps: true
});

DonationSchema.index({ location: '2dsphere' });

const RealDonation = model('Donation', DonationSchema);

class MockDonation extends MockModel {
  static db: any[] = [];
}

export const Donation = new Proxy(RealDonation, {
  get(target, prop, receiver) {
    if (mongoose.connection.readyState !== 1) {
      return Reflect.get(MockDonation, prop, receiver);
    }
    return Reflect.get(target, prop, receiver);
  },
  construct(target, args, newTarget) {
    if (mongoose.connection.readyState !== 1) {
      return Reflect.construct(MockDonation, args, newTarget);
    }
    return Reflect.construct(target, args, newTarget);
  }
}) as any;

export { FoodItemSchema };
