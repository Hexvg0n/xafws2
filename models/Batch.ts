// models/Batch.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IBatch extends Document {
  name: string;
  sourceUrl: string;
  thumbnailUrl?: string;
  mainImages: string[];
  description?: string;
  priceCNY: number;
  availableColors: string[];
  availableSizes: string[];
  shopInfo?: {
    ShopName?: string;
    ShopLogo?: string;
    ShopID?: string;
  };
  batch: string; // Nazwa batcha
  views: number;
  favorites: number;
  createdBy: Schema.Types.ObjectId;
}

const BatchSchema: Schema = new Schema({
    name: { type: String, required: true, trim: true },
    sourceUrl: { type: String, required: true, unique: true },
    thumbnailUrl: { type: String },
    platform: { type: String, enum: ['1688', 'taobao', 'weidian', 'tmall'] },
    mainImages: [String],
    description: { type: String },
    priceCNY: { type: Number },
    shopInfo: {
        ShopName: String,
        ShopLogo: String,
        ShopID: String,
    },
    dimensions: {
        Length: Number,
        Width: Number,
        Height: Number,
    },
    skus: [mongoose.Schema.Types.Mixed],
    availableColors: [String],
    availableSizes: [String],
    batch: { type: String, required: true, trim: true },
    views: { type: Number, default: 0 },
    favorites: { type: Number, default: 0 },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

export default mongoose.models.Batch || mongoose.model<IBatch>('Batch', BatchSchema);