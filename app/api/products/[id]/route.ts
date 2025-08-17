import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/models/Product';

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
        const { name, sourceUrl, shopInfo } = body;

        await dbConnect();
        
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            params.id,
            { name, sourceUrl, shopInfo },
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

        return NextResponse.json({ message: "Produkt został pomyślnie usunięty." }, { status: 200 });

    } catch (error) {
        console.error("Błąd podczas usuwania produktu:", error);
        return NextResponse.json({ error: 'Błąd serwera.' }, { status: 500 });
    }
}