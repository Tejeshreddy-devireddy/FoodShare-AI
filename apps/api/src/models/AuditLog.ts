import mongoose, { Schema, model } from 'mongoose';
import { MockModel } from './mockDb';

const AuditLogSchema = new Schema({
  actor: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  actorEmail: { type: String },
  action: { type: String, required: true },
  target: { type: String },
  details: { type: Schema.Types.Mixed },
  ipAddress: { type: String },
  userAgent: { type: String }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

const RealAuditLog = model('AuditLog', AuditLogSchema);

class MockAuditLog extends MockModel {
  static db: any[] = [];
}

export const AuditLog = new Proxy(RealAuditLog, {
  get(target, prop, receiver) {
    if (mongoose.connection.readyState !== 1) {
      return Reflect.get(MockAuditLog, prop, receiver);
    }
    return Reflect.get(target, prop, receiver);
  },
  construct(target, args, newTarget) {
    if (mongoose.connection.readyState !== 1) {
      return Reflect.construct(MockAuditLog, args, newTarget);
    }
    return Reflect.construct(target, args, newTarget);
  }
}) as any;
