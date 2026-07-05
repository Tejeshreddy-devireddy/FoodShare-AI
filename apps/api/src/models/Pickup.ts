import mongoose, { Schema, model } from 'mongoose';
import { MockModel } from './mockDb';

const TrackingEventSchema = new Schema({
  coordinates: { type: [Number] }, // [longitude, latitude]
  timestamp: { type: Date, default: Date.now },
  description: { type: String }
});

const PickupSchema = new Schema({
  donation: { type: Schema.Types.ObjectId, ref: 'Donation', required: true },
  ngo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  volunteer: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in_transit', 'picked_up', 'delivered', 'failed'],
    default: 'pending'
  },
  verificationOtp: { type: String, required: true },
  verificationQrHash: { type: String, required: true },
  deliveryProofImage: { type: String, default: null },
  deliveryNote: { type: String },
  trackingPath: [TrackingEventSchema],
  rating: { type: Number, min: 1, max: 5 },
  completedAt: { type: Date }
}, {
  timestamps: true
});

const RealPickup = model('Pickup', PickupSchema);

class MockPickup extends MockModel {
  static db: any[] = [];
}

export const Pickup = new Proxy(RealPickup, {
  get(target, prop, receiver) {
    if (mongoose.connection.readyState !== 1) {
      return Reflect.get(MockPickup, prop, receiver);
    }
    return Reflect.get(target, prop, receiver);
  },
  construct(target, args, newTarget) {
    if (mongoose.connection.readyState !== 1) {
      return Reflect.construct(MockPickup, args, newTarget);
    }
    return Reflect.construct(target, args, newTarget);
  }
}) as any;
