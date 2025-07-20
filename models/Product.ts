// models/Product.ts
import mongoose, { Schema } from 'mongoose';

const ProductSchema = new Schema({
    name: { type: String, required: true, trim: true },
    sourceUrl: { type: String, required:true, unique: true },
    
    // NOWE POLE NA GŁÓWNĄ MINIATURKĘ
    thumbnailUrl: { type: String }, 
    
    platform: { type: String, enum: ['1688', 'Taobao', 'Weidian'] },
    mainImages: [String],
    descriptionImages: [String],
    priceCNY: { type: Number },
    availableColors: [String],
    availableSizes: [String],
    shopInfo: {
        shopName: String,
        shopLogo: String,
        shopId: String,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {
    timestamps: true,
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);