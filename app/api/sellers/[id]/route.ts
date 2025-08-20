// app/api/sellers/[id]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Seller from '@/models/Seller';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import mongoose from 'mongoose';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user || !['admin', 'root'].includes(session.user.role)) {
        return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 });
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
        return NextResponse.json({ error: "Nieprawidłowy identyfikator sprzedawcy" }, { status: 400 });
    }

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

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user || !['admin', 'root'].includes(session.user.role)) {
        return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 });
    }
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
        return NextResponse.json({ error: "Nieprawidłowy identyfikator sprzedawcy" }, { status: 400 });
    }
    await dbConnect();
    try {
        const deletedSeller = await Seller.findByIdAndDelete(params.id);
        if (!deletedSeller) return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
        return NextResponse.json({ message: 'Seller deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting seller' }, { status: 500 });
    }
}