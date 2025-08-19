// models/CurrencyRate.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface ICurrencyRate extends Document {
  base: string;
  rates: Map<string, number>;
  lastUpdated: Date;
}

const CurrencyRateSchema: Schema = new Schema({
  base: { type: String, required: true, unique: true, default: 'CNY' },
  rates: { type: Map, of: Number, required: true },
  lastUpdated: { type: Date, required: true },
});

export default mongoose.models.CurrencyRate || mongoose.model<ICurrencyRate>('CurrencyRate', CurrencyRateSchema);