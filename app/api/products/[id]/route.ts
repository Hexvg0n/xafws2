// app/api/products/[id]/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/models/Product';
import fs from 'fs/promises';
import path from 'path';

interface Params {
    params: { id: string }
}

// Funkcja PATCH do aktualizacji produktu
export async function PATCH(req: Request, { params }: Params) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, sourceUrl } = body;

        if (!name && !sourceUrl) {
            return NextResponse.json({ error: "Brak danych do aktualizacji." }, { status: 400 });
        }

        await dbConnect();
        
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            params.id,
            { name, sourceUrl },
            { new: true, runValidators: true } // 'new: true' zwraca zaktualizowany dokument
        );

        if (!updatedProduct) {
            return NextResponse.json({ error: "Nie znaleziono produktu." }, { status: 404 });
        }

        return NextResponse.json(updatedProduct, { status: 200 });

    } catch (error) {
        console.error("Błąd podczas aktualizacji produktu:", error);
        return NextResponse.json({ error: 'Błąd serwera.' }, { status: 500 });
    }
}

// Funkcja DELETE do usuwania produktu
export async function DELETE(req: Request, { params }: Params) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !['admin', 'root'].includes(session.user.role)) {
        return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 });
    }

    try {
        await dbConnect();
        const productToDelete = await ProductModel.findByIdAndDelete(params.id);

        if (!productToDelete) {
            return NextResponse.json({ error: "Nie znaleziono produktu do usunięcia." }, { status: 404 });
        }

        // Usuwamy również plik obrazka z serwera
        if (productToDelete.imageUrl) {
            const imagePath = path.join(process.cwd(), 'public', productToDelete.imageUrl);
            await fs.unlink(imagePath).catch(err => console.log("Nie udało się usunąć pliku obrazka:", err.message));
        }

        return NextResponse.json({ message: "Produkt został pomyślnie usunięty." }, { status: 200 });

    } catch (error) {
        console.error("Błąd podczas usuwania produktu:", error);
        return NextResponse.json({ error: 'Błąd serwera.' }, { status: 500 });
    }
}