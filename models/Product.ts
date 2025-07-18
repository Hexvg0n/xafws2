// models/Product.ts

import mongoose, { Schema } from 'mongoose';

const ProductSchema = new Schema({
    name: { type: String, required: true, trim: true },
    sourceUrl: { type: String, required: true, unique: true },
    platform: { type: String, enum: ['1688', 'Taobao', 'Weidian'] },

    // Główne obrazy produktu
    mainImages: [String], 
    // Obrazy z opisu produktu
    descriptionImages: [String], 
    
    priceCNY: { type: Number },

    formattedDimensions: String,
    
    // Unikalne, wyciągnięte z wariantów (SKUs)
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