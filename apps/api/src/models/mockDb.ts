import { Types } from 'mongoose';

export class QueryChain {
  data: any[];
  constructor(data: any[]) {
    this.data = data;
  }
  populate() {
    return this;
  }
  sort() {
    return this;
  }
  limit() {
    return this;
  }
  // Chaining support for then/catch (Promise-like)
  then(onfulfilled?: (value: any) => any) {
    if (onfulfilled) return Promise.resolve(this.data).then(onfulfilled);
    return Promise.resolve(this.data);
  }
}

export class MockModel {
  static db: any[] = [];
  _id: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(fields: any) {
    Object.assign(this, fields);
    this._id = fields._id || new Types.ObjectId().toString();
    this.createdAt = new Date();
    this.updatedAt = new Date();

    const modelName = this.constructor.name;
    if (modelName === 'MockUser') {
      (this as any).status = fields.status || 'active';
      (this as any).emailVerified = fields.emailVerified || false;
      (this as any).twoFactorEnabled = fields.twoFactorEnabled || false;
    } else if (modelName === 'MockDonation') {
      (this as any).status = fields.status || 'available';
      (this as any).freshnessScore = fields.freshnessScore !== undefined ? fields.freshnessScore : 100;
      (this as any).shelfLifeHours = fields.shelfLifeHours !== undefined ? fields.shelfLifeHours : 24;
      (this as any).foodItems = fields.foodItems || [];
      (this as any).images = fields.images || [];
    } else if (modelName === 'MockPickup') {
      (this as any).status = fields.status || 'pending';
      (this as any).trackingPath = fields.trackingPath || [];
    }
    
    // Ensure nested objects are initialized to prevent undefined errors in stats increments
    if (!(this as any).stats) {
      (this as any).stats = { mealsSaved: 0, carbonSaved: 0, waterSaved: 0, points: 0 };
    }
  }

  async save() {
    const list = (this.constructor as any).db;
    const idx = list.findIndex((item: any) => item._id.toString() === this._id.toString());
    if (idx >= 0) {
      list[idx] = this;
    } else {
      list.push(this);
    }
    return this;
  }

  set(path: string, val: any) {
    (this as any)[path] = val;
    return this;
  }

  static async find(query: any = {}) {
    let results = [...this.db];
    if (query.status) {
      results = results.filter(r => r.status === query.status);
    }
    if (query.email) {
      results = results.filter(r => r.email === query.email);
    }
    return new QueryChain(results) as any;
  }

  static async findOne(query: any = {}) {
    const results = this.db.find((item: any) => {
      for (const key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
    return results || null;
  }

  static async findById(id: any) {
    if (!id) return null;
    const results = this.db.find((item: any) => item._id.toString() === id.toString());
    return results || null;
  }

  static async findByIdAndUpdate(id: any, update: any, options: any = {}) {
    const doc = await this.findById(id);
    if (!doc) return null;

    if (update.$inc) {
      for (const k in update.$inc) {
        const keys = k.split('.');
        let obj = doc;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!obj[keys[i]]) obj[keys[i]] = {};
          obj = obj[keys[i]];
        }
        const lastKey = keys[keys.length - 1];
        obj[lastKey] = (obj[lastKey] || 0) + update.$inc[k];
      }
    }
    if (update.$set) {
      Object.assign(doc, update.$set);
    }
    await doc.save();
    return doc;
  }

  static async create(fields: any) {
    const doc = new this(fields);
    await doc.save();
    return doc;
  }

  static async countDocuments(query: any = {}) {
    return this.db.length;
  }

  static async aggregate(pipeline: any[] = []) {
    return [{ totalCarbonSaved: 2450, totalMeals: 850 }];
  }
}
export default MockModel;
