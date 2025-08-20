// app/api/batches/[id]/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import BatchModel from '@/models/Batch';
import mongoose from "mongoose";

interface Params {
    params: { id: string }
}

// --- FUNKCJA PATCH (EDYCJA) ---
export async function PATCH(req: Request, { params }: Params) {
    const session = await getServerSession(authOptions);
    if (!session?.user || !['admin', 'root', 'adder'].includes(session.user.role)) {
        return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 });
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
        return NextResponse.json({ error: "Nieprawidłowy identyfikator partii" }, { status: 400 });
    }

    try {
        const body = await req.json();
        await dbConnect();
        
        const updatedBatch = await BatchModel.findByIdAndUpdate(
            params.id,
            body,
            { new: true, runValidators: true }
        );

        if (!updatedBatch) {
            return NextResponse.json({ error: "Nie znaleziono batcha." }, { status: 404 });
        }

        return NextResponse.json(updatedBatch, { status: 200 });

    } catch (error) {
        console.error("Błąd podczas aktualizacji batcha:", error);
        return NextResponse.json({ error: 'Błąd serwera.' }, { status: 500 });
    }
}

// --- FUNKCJA DELETE (USUWANIE) ---
export async function DELETE(req: Request, { params }: Params) {
    const session = await getServerSession(authOptions);
     if (!session?.user || !['admin', 'root', 'adder'].includes(session.user.role)) {
        return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 });
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
        return NextResponse.json({ error: "Nieprawidłowy identyfikator partii" }, { status: 400 });
    }

    try {
        await dbConnect();
        const deletedBatch = await BatchModel.findByIdAndDelete(params.id);

        if (!deletedBatch) {
            return NextResponse.json({ error: "Nie znaleziono batcha do usunięcia." }, { status: 404 });
        }

        return NextResponse.json({ message: "Batch został pomyślnie usunięty." }, { status: 200 });

    } catch (error) {
        console.error("Błąd podczas usuwania batcha:", error);
        return NextResponse.json({ error: 'Błąd serwera.' }, { status: 500 });
    }
}