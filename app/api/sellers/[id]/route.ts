import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Seller from '@/models/Seller';

// PATCH - Aktualizacja sprzedawcy
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const body = await req.json();
        const updatedSeller = await Seller.findByIdAndUpdate(params.id, body, { new: true });
        if (!updatedSeller) return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
        return NextResponse.json(updatedSeller);
    } catch (error) {
        return NextResponse.json({ error: 'Error updating seller' }, { status: 400 });
    }
}

// DELETE - Usunięcie sprzedawcy
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const deletedSeller = await Seller.findByIdAndDelete(params.id);
        if (!deletedSeller) return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
        return NextResponse.json({ message: 'Seller deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting seller' }, { status: 500 });
    }
}