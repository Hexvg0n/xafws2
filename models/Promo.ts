import mongoose, { Schema, Document } from 'mongoose';

export interface IPromo extends Document {
  title: string;
  seller: string;
  image: string;
  link: string;
  price: number;
  code: string; // DODANE BRAKUJĄCE POLE
}

const PromoSchema: Schema = new Schema({
  title: { type: String, required: true },
  seller: { type: String, required: true },
  image: { type: String, required: true },
  link: { type: String, required: true },
  price: { type: Number, required: true },
  code: { type: String, required: true }, // DODANE BRAKUJĄCE POLE
}, { timestamps: true });

export default mongoose.models.Promo || mongoose.model<IPromo>('Promo', PromoSchema);