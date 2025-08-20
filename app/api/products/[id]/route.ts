// app/api/products/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/models/Product';
import mongoose from 'mongoose';
import { promises as fs } from 'fs';
import path from 'path';

// Funkcja pomocnicza do bezpiecznego usuwania pliku
const deleteFile = async (filePath: string) => {
    try {
        const fullPath = path.join(process.cwd(), 'public', filePath);
        await fs.unlink(fullPath);
    } catch (error) {
        console.warn(`Nie udało się usunąć pliku: ${filePath}`, error);
    }
};

// --- FUNKCJA PATCH (EDYCJA) ---
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    // ... (ta funkcja pozostaje bez zmian)
    const session = await getServerSession(authOptions);
    if (!session?.user || !['admin', 'root'].includes(session.user.role)) {
        return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 });
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
        return NextResponse.json({ error: "Nieprawidłowy identyfikator produktu" }, { status: 400 });
    }

    try {
        const body = await req.json();
        await dbConnect();
        
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            params.id,
            body,
            { new: true, runValidators: true }
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

// --- FUNKCJA DELETE (USUWANIE) ---
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !['admin', 'root'].includes(session.user.role)) {
        return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 });
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
        return NextResponse.json({ error: "Nieprawidłowy identyfikator produktu" }, { status: 400 });
    }

    try {
        await dbConnect();
        
        // ZNAJDŹ PRODUKT PRZED USUNIĘCIEM, ABY UZYSKAĆ ŚCIEŻKI DO ZDJĘĆ
        const productToDelete = await ProductModel.findById(params.id);

        if (!productToDelete) {
            return NextResponse.json({ error: "Nie znaleziono produktu do usunięcia." }, { status: 404 });
        }

        // USUŃ POWIĄZANE ZDJĘCIA
        if (productToDelete.thumbnailUrl) {
            await deleteFile(productToDelete.thumbnailUrl);
        }
        if (productToDelete.mainImages && productToDelete.mainImages.length > 0) {
            for (const imageUrl of productToDelete.mainImages) {
                await deleteFile(imageUrl);
            }
        }
        
        // USUŃ PRODUKT Z BAZY DANYCH
        await ProductModel.findByIdAndDelete(params.id);

        return NextResponse.json({ message: "Produkt i powiązane zdjęcia zostały pomyślnie usunięte." }, { status: 200 });

    } catch (error) {
        console.error("Błąd podczas usuwania produktu:", error);
        return NextResponse.json({ error: 'Błąd serwera.' }, { status: 500 });
    }
}