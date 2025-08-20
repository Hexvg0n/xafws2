// app/api/best-batch/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import BestBatchModel from '@/models/BestBatch';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

// GET - Pobierz wszystkie produkty Best Batch
export async function GET() {
    await dbConnect();
    try {
        const items = await BestBatchModel.find({}).populate('category').sort({ createdAt: -1 });
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
    }
}

// POST - Stwórz nowy produkt Best Batch
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const newItem = new BestBatchModel({
            ...body,
            createdBy: session.user.id
        });
        await newItem.save();
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Błąd podczas tworzenia' }, { status: 400 });
    }
}