// app/api/products/[id]/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/models/Product';
import { logHistory } from '@/lib/historyLogger'; // <<< Nowy import

interface Params {
    params: { id: string }
}

// --- FUNKCJA PATCH (EDYCJA) ---
export async function PATCH(req: Request, { params }: Params) {
    const session = await getServerSession(authOptions);
    if (!session?.user || !['admin', 'root'].includes(session.user.role)) {
        return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 });
    }

    try {
        const body = await req.json();
        
        await dbConnect();
        
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            params.id,
            body, // Przekazujemy całe body, aby umożliwić aktualizację różnych pól
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return NextResponse.json({ error: "Nie znaleziono produktu." }, { status: 404 });
        }

        // <<< DODANE LOGOWANIE DO HISTORII >>>
        await logHistory(session, 'edit', 'product', updatedProduct._id.toString(), `zedytował produkt "${updatedProduct.name}"`);

        return NextResponse.json(updatedProduct, { status: 200 });

    } catch (error) {
        console.error("Błąd podczas aktualizacji produktu:", error);
        return NextResponse.json({ error: 'Błąd serwera.' }, { status: 500 });
    }
}

// --- FUNKCJA DELETE (USUWANIE) ---
export async function DELETE(req: Request, { params }: Params) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !['admin', 'root'].includes(session.user.role)) {
        return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 });
    }

    try {
        await dbConnect();
        const deletedProduct = await ProductModel.findByIdAndDelete(params.id);

        if (!deletedProduct) {
            return NextResponse.json({ error: "Nie znaleziono produktu do usunięcia." }, { status: 404 });
        }

        // <<< DODANE LOGOWANIE DO HISTORII >>>
        await logHistory(session, 'delete', 'product', deletedProduct._id.toString(), `usunął produkt "${deletedProduct.name}"`);

        return NextResponse.json({ message: "Produkt został pomyślnie usunięty." }, { status: 200 });

    } catch (error) {
        console.error("Błąd podczas usuwania produktu:", error);
        return NextResponse.json({ error: 'Błąd serwera.' }, { status: 500 });
    }
}