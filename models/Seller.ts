// models/Seller.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface ISeller extends Document {
  name: string;
  image: string;
  link: string; // <-- NOWE POLE
  rating: number;
  description: string;
  clicks: number;
}

const SellerSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  link: { type: String, required: true }, // <-- NOWE POLE
  rating: { type: Number, default: 0, min: 0, max: 5 },
  description: { type: String },
  clicks: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Seller || mongoose.model<ISeller>('Seller', SellerSchema);