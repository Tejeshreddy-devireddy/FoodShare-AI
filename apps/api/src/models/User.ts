import mongoose, { Schema, model } from 'mongoose';
import { MockModel } from './mockDb';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const mockPasswordHash = process.env.MOCK_USER_PASSWORD
  ? bcrypt.hashSync(process.env.MOCK_USER_PASSWORD, 10)
  : bcrypt.hashSync('password123', 10);

const UserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['Admin', 'Donor', 'NGO', 'Volunteer', 'Government', 'CSR Team'],
    required: true,
  },
  emailVerified: { type: Boolean, default: false },
  verificationCode: { type: String, default: null },
  otpExpires: { type: Date, default: null },
  otpAttempts: { type: Number, default: 0 },
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String, default: null },
  profilePhoto: { type: String, default: null },
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended'],
    default: 'active',
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }, // [longitude, latitude]
  },
  stats: {
    mealsSaved: { type: Number, default: 0 },
    carbonSaved: { type: Number, default: 0 },
    waterSaved: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
  },
  ngoDetails: {
    registrationNumber: { type: String },
    capacity: { type: Number },
    preferredFoodTypes: [{ type: String }],
    verified: { type: Boolean, default: false },
  },
  donorDetails: {
    organizationType: { type: String, enum: ['Restaurant', 'Hotel', 'Bakery', 'Catering', 'Marriage Hall', 'Supermarket', 'Individual'] },
    businessLicense: { type: String },
  }
}, {
  timestamps: true
});

UserSchema.index({ location: '2dsphere' });

const RealUser = model('User', UserSchema);

class MockUser extends MockModel {
  static db: any[] = [];
}

MockUser.db = [
  new MockUser({
    _id: 'usr_donor_1',
    name: 'Grand Garden Restaurant',
    email: 'donor@restaurant.com',
    password: mockPasswordHash,
    role: 'Donor',
    donorDetails: { organizationType: 'Restaurant', businessLicense: 'LIC-942821' },
    emailVerified: true,
    status: 'active',
    location: { type: 'Point', coordinates: [77.5946, 12.9716] },
    stats: { mealsSaved: 140, carbonSaved: 350, waterSaved: 21000, points: 0 }
  }),
  new MockUser({
    _id: 'usr_ngo_1',
    name: 'Bangalore Food Share NGO',
    email: 'ngo@foodshare.org',
    password: mockPasswordHash,
    role: 'NGO',
    ngoDetails: { registrationNumber: 'NGO-29402', capacity: 200, verified: true },
    emailVerified: true,
    status: 'active',
    location: { type: 'Point', coordinates: [77.5946, 12.9716] },
    stats: { mealsSaved: 0, carbonSaved: 0, waterSaved: 0, points: 0 }
  }),
  new MockUser({
    _id: 'usr_vol_1',
    name: 'Alex Ryder (Courier)',
    email: 'volunteer@express.com',
    password: mockPasswordHash,
    role: 'Volunteer',
    emailVerified: true,
    status: 'active',
    location: { type: 'Point', coordinates: [77.5946, 12.9716] },
    stats: { mealsSaved: 0, carbonSaved: 0, waterSaved: 0, points: 350 }
  }),
  new MockUser({
    _id: 'usr_admin_1',
    name: 'System Administrator',
    email: 'admin@foodshare.org',
    password: mockPasswordHash,
    role: 'Admin',
    emailVerified: true,
    status: 'active',
    location: { type: 'Point', coordinates: [77.5946, 12.9716] },
    stats: { mealsSaved: 0, carbonSaved: 0, waterSaved: 0, points: 0 }
  })
];

export const User = new Proxy(RealUser, {
  get(target, prop, receiver) {
    if (mongoose.connection.readyState !== 1) {
      return Reflect.get(MockUser, prop, receiver);
    }
    return Reflect.get(target, prop, receiver);
  },
  construct(target, args, newTarget) {
    if (mongoose.connection.readyState !== 1) {
      return Reflect.construct(MockUser, args, newTarget);
    }
    return Reflect.construct(target, args, newTarget);
  }
}) as any;
