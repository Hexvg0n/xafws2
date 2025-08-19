// models/Product.ts

import mongoose, { Schema } from 'mongoose';

const ProductSchema = new Schema({
    name: { 
        type: String, 
        required: [true, 'Nazwa produktu jest wymagana.'], 
        trim: true 
    },
    sourceUrl: { 
        type: String, 
        required: true, 
        unique: true 
    },
    thumbnailUrl: { type: String },
    // Upewnij się, że ta linia wygląda dokładnie tak:
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
    views: { type: Number, default: 0 },
    favorites: { type: Number, default: 0 },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {
    timestamps: true,
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);