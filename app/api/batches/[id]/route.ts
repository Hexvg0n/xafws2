import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Batch from '@/models/Batch';

// PATCH - Aktualizacja batcha
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const body = await req.json();
        const updatedBatch = await Batch.findByIdAndUpdate(params.id, body, { new: true });
        if (!updatedBatch) return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
        return NextResponse.json(updatedBatch);
    } catch (error) {
        return NextResponse.json({ error: 'Error updating batch' }, { status: 400 });
    }
}

// DELETE - Usunięcie batcha
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const deletedBatch = await Batch.findByIdAndDelete(params.id);
        if (!deletedBatch) return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
        return NextResponse.json({ message: 'Batch deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting batch' }, { status: 500 });
    }
}