import mongoose, { Schema, Document } from 'mongoose';

export interface IBatch extends Document {
  title: string;
  image: string;
  price: number;
  link: string;
  batch_name: string;
  rating: number; // DODANE BRAKUJĄCE POLE
  views: number;
  favorites: number;
  clicks: number;
}

const BatchSchema: Schema = new Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  link: { type: String, required: true },
  batch_name: { type: String, required: true },
  rating: { type: Number, default: 0 }, // DODANE BRAKUJĄCE POLE
  views: { type: Number, default: 0 },
  favorites: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Batch || mongoose.model<IBatch>('Batch', BatchSchema);