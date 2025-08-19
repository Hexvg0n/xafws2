// app/api/stats/track/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Seller from '@/models/Seller';
import Batch from '@/models/Batch';
import ProductModel from '@/models/Product';

export async function POST(req: Request) {
    await dbConnect();
    try {
        const { type, id } = await req.json();

        if (!type || !id) {
            return NextResponse.json({ error: 'Missing type or id' }, { status: 400 });
        }

        let updateResult;
        
        switch(type) {
            // ZMIANA: Dodano nową obsługę zdarzenia
            case 'sellerClick':
                updateResult = await Seller.findByIdAndUpdate(id, { $inc: { clicks: 1 } });
                break;
            case 'batchClick':
                updateResult = await Batch.findByIdAndUpdate(id, { $inc: { clicks: 1 } });
                break;
            case 'productView':
                updateResult = await ProductModel.findByIdAndUpdate(id, { $inc: { views: 1 } });
                break;
            case 'productFavorite':
                updateResult = await ProductModel.findByIdAndUpdate(id, { $inc: { favorites: 1 } });
                break;
            case 'productUnfavorite':
                updateResult = await ProductModel.findByIdAndUpdate(id, { $inc: { favorites: -1 } });
                break;
            default:
                return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }

        if (!updateResult) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Błąd w API /api/stats/track:", error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}