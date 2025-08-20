// app/api/profile/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import '@/models/Product';
import '@/models/Batch'; // <<< UPEWNIJ SIĘ, ŻE TEN IMPORT ISTNIEJE

// Handler do pobierania danych profilu
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
    }

    try {
        await dbConnect();
        const user = await UserModel.findById(session.user.id)
            .select('nickname email avatar wishlist batchWishlist preferredAgent preferredCurrency') // <<< DODAJ batchWishlist
            .populate('wishlist')
            .populate('batchWishlist'); // <<< DODAJ populate dla batchWishlist

        if (!user) {
            return NextResponse.json({ error: 'Nie znaleziono użytkownika' }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Błąd podczas pobierania profilu:", error);
        return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
    }
}

// Handler do aktualizacji danych profilu (bez zmian)
export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { preferredAgent, preferredCurrency } = body;

        await dbConnect();
        
        const updatedUser = await UserModel.findByIdAndUpdate(
            session.user.id,
            { preferredAgent, preferredCurrency },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ error: 'Nie znaleziono użytkownika' }, { status: 404 });
        }

        return NextResponse.json({ message: "Ustawienia zaktualizowane.", user: updatedUser }, { status: 200 });
    } catch (error) {
        console.error("Błąd podczas aktualizacji profilu:", error);
        return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
    }
}