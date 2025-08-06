import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Seller from '@/models/Seller';
import Batch from '@/models/Batch';

export async function POST(req: Request) {
    await dbConnect();
    try {
        const { type, id } = await req.json();

        if (!type || !id) {
            return NextResponse.json({ error: 'Missing type or id' }, { status: 400 });
        }

        let updateResult;
        
        switch(type) {
            case 'sellerClick':
                updateResult = await Seller.findByIdAndUpdate(id, { $inc: { clicks: 1 } });
                break;
            case 'batchClick':
                updateResult = await Batch.findByIdAndUpdate(id, { $inc: { clicks: 1 } });
                break;
            case 'batchView':
                updateResult = await Batch.findByIdAndUpdate(id, { $inc: { views: 1 } });
                break;
            case 'batchFavorite':
                updateResult = await Batch.findByIdAndUpdate(id, { $inc: { favorites: 1 } });
                break;
            default:
                return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }

        if (!updateResult) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}