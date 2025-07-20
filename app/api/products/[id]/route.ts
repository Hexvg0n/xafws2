// app/api/products/[id]/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route'; // Upewnij się, że ścieżka jest poprawna
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/models/Product';
import mongoose from 'mongoose';

type RouteContext = {
    params: {
        id: string;
    }
}

// Funkcja pomocnicza do sprawdzania uprawnień
const hasPermission = (session: any): boolean => {
    if (!session?.user?.role) return false;
    const allowedRoles: string[] = ['root', 'admin', 'adder'];
    return allowedRoles.includes(session.user.role);
}


export async function GET(_req: Request, context: RouteContext) {
    const { id } = context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: 'Nieprawidłowy format ID produktu.' }, { status: 400 });
    }

    try {
        await dbConnect();
        const product = await ProductModel.findById(id);

        if (!product) {
            return NextResponse.json({ error: 'Produkt nie został znaleziony.' }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error("Błąd podczas pobierania produktu:", error);
        return NextResponse.json({ error: 'Wystąpił błąd serwera.' }, { status: 500 });
    }
}


// --- PATCH Handler (Update a product) ---
export async function PATCH(req: Request, context: RouteContext) {
    const session = await getServerSession(authOptions);
    if (!hasPermission(session)) {
        return NextResponse.json({ error: 'Brak autoryzacji lub niewystarczające uprawnienia.' }, { status: 403 });
    }

    const { id } = context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: 'Nieprawidłowy format ID produktu.' }, { status: 400 });
    }

    try {
        const body = await req.json();
        const { name, sourceUrl, thumbnailUrl } = body;

        const updateData: { [key: string]: any } = {};
        if (name) updateData.name = name;
        if (sourceUrl) updateData.sourceUrl = sourceUrl;
        if (thumbnailUrl) updateData.thumbnailUrl = thumbnailUrl;

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: 'Należy podać przynajmniej jedno pole do aktualizacji.' }, { status: 400 });
        }

        await dbConnect();
        const updatedProduct = await ProductModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!updatedProduct) {
            return NextResponse.json({ error: 'Produkt nie został znaleziony.' }, { status: 404 });
        }

        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error("Błąd podczas aktualizacji produktu:", error);
        if (error instanceof mongoose.Error.ValidationError) {
             return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: 'Wystąpił błąd serwera.' }, { status: 500 });
    }
}

// --- DELETE Handler (Delete a product) ---
export async function DELETE(_req: Request, context: RouteContext) {
    const session = await getServerSession(authOptions);
     if (!hasPermission(session)) {
        return NextResponse.json({ error: 'Brak autoryzacji lub niewystarczające uprawnienia.' }, { status: 403 });
    }

    const { id } = context.params;

     if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: 'Nieprawidłowy format ID produktu.' }, { status: 400 });
    }

    try {
        await dbConnect();
        const deletedProduct = await ProductModel.findByIdAndDelete(id);

        if (!deletedProduct) {
            return NextResponse.json({ error: 'Produkt nie został znaleziony.' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Produkt został pomyślnie usunięty.' });

    } catch (error) {
        console.error("Błąd podczas usuwania produktu:", error);
        return NextResponse.json({ error: 'Wystąpił błąd serwera.' }, { status: 500 });
    }
}