// app/api/profile/wishlist/route.ts
    
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
    
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
    }

    try {
        const { productId } = await req.json();
        if (!productId) {
            return NextResponse.json({ error: 'Brak ID produktu' }, { status: 400 });
        }

        await dbConnect();
        const user = await UserModel.findById(session.user.id);
        if (!user) {
            return NextResponse.json({ error: 'Nie znaleziono użytkownika' }, { status: 404 });
        }

        // Poprawka: Inicjalizuj wishlist jako pustą tablicę, jeśli nie istnieje
        if (!user.wishlist) {
            user.wishlist = [];
        }

        const index = user.wishlist.indexOf(productId);
        let updatedUser;

        if (index > -1) {
            // Produkt jest już na liście - usuwamy go
            user.wishlist.splice(index, 1);
            updatedUser = await user.save();
            return NextResponse.json({ message: "Usunięto z ulubionych", wishlist: updatedUser.wishlist });
        } else {
            // Produktu nie ma na liście - dodajemy go
            user.wishlist.push(productId);
            updatedUser = await user.save();
            return NextResponse.json({ message: "Dodano do ulubionych", wishlist: updatedUser.wishlist });
        }

    } catch (error) {
        console.error("Błąd podczas aktualizacji wishlisty:", error);
        return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
    }
}