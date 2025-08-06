import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Promo from '@/models/Promo';

// PATCH - Aktualizacja promocji
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const body = await req.json();
        const updatedPromo = await Promo.findByIdAndUpdate(params.id, body, { new: true });
        if (!updatedPromo) return NextResponse.json({ error: 'Promo not found' }, { status: 404 });
        return NextResponse.json(updatedPromo);
    } catch (error) {
        return NextResponse.json({ error: 'Error updating promo' }, { status: 400 });
    }
}

// DELETE - Usunięcie promocji
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const deletedPromo = await Promo.findByIdAndDelete(params.id);
        if (!deletedPromo) return NextResponse.json({ error: 'Promo not found' }, { status: 404 });
        return NextResponse.json({ message: 'Promo deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting promo' }, { status: 500 });
    }
}