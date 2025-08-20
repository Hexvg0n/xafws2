// app/api/sellers/[id]/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Seller from '@/models/Seller';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { logHistory } from '@/lib/historyLogger';

// PATCH - Aktualizacja sprzedawcy
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
    }

    await dbConnect();
    try {
        const body = await req.json();
        const updatedSeller = await Seller.findByIdAndUpdate(params.id, body, { new: true });
        if (!updatedSeller) return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
        
        // <<< LOGOWANIE DO HISTORII >>>
        await logHistory(session, 'edit', 'seller', updatedSeller._id.toString(), `zedytował sprzedawcę "${updatedSeller.name}"`);

        return NextResponse.json(updatedSeller);
    } catch (error) {
        return NextResponse.json({ error: 'Error updating seller' }, { status: 400 });
    }
}

// DELETE - Usunięcie sprzedawcy
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
    }

    await dbConnect();
    try {
        const deletedSeller = await Seller.findByIdAndDelete(params.id);
        if (!deletedSeller) return NextResponse.json({ error: 'Seller not found' }, { status: 404 });

        // <<< LOGOWANIE DO HISTORII >>>
        await logHistory(session, 'delete', 'seller', deletedSeller._id.toString(), `usunął sprzedawcę "${deletedSeller.name}"`);

        return NextResponse.json({ message: 'Seller deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting seller' }, { status: 500 });
    }
}