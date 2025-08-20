// app/api/best-batch/[id]/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import BestBatchModel from '@/models/BestBatch';

// PATCH - Aktualizuj produkt
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const body = await req.json();
        const updatedItem = await BestBatchModel.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
        if (!updatedItem) {
            return NextResponse.json({ error: 'Nie znaleziono' }, { status: 404 });
        }
        return NextResponse.json(updatedItem);
    } catch (error) {
        return NextResponse.json({ error: 'Błąd aktualizacji' }, { status: 400 });
    }
}

// DELETE - Usuń produkt
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const deletedItem = await BestBatchModel.findByIdAndDelete(params.id);
        if (!deletedItem) {
            return NextResponse.json({ error: 'Nie znaleziono' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Usunięto pomyślnie' });
    } catch (error) {
        return NextResponse.json({ error: 'Błąd usuwania' }, { status: 500 });
    }
}