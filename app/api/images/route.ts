// app/api/images/route.ts

import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/models/Product';
import BatchModel from '@/models/Batch';

export async function GET() {
    try {
        await dbConnect();

        const linkedImages: { src: string; id: string; type: 'product' | 'batch' }[] = [];

        // Pobierz obrazki z produktów
        const products = await ProductModel.find({ thumbnailUrl: { $ne: null } }).select('_id thumbnailUrl');
        products.forEach(product => {
            if (product.thumbnailUrl) {
                linkedImages.push({
                    src: product.thumbnailUrl,
                    id: product._id.toString(),
                    type: 'product'
                });
            }
        });

        // Pobierz obrazki z batchy
        const batches = await BatchModel.find({ thumbnailUrl: { $ne: null } }).select('_id thumbnailUrl');
        batches.forEach(batch => {
            if (batch.thumbnailUrl) {
                linkedImages.push({
                    src: batch.thumbnailUrl,
                    id: batch._id.toString(),
                    type: 'batch'
                });
            }
        });

        return NextResponse.json({ images: linkedImages });
    } catch (error) {
        console.error("Błąd podczas wczytywania obrazków:", error);
        return NextResponse.json({ error: 'Nie udało się załadować obrazków.' }, { status: 500 });
    }
}