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
    dimensions: {
        length: Number,
        width: Number,
        height: Number,
    },
    skus: [mongoose.Schema.Types.Mixed], 
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {
    timestamps: true,
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);