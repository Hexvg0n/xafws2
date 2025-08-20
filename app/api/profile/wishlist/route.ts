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
        const { itemId, itemType } = await req.json();
        if (!itemId || !itemType) {
            return NextResponse.json({ error: 'Brak ID lub typu przedmiotu' }, { status: 400 });
        }

        await dbConnect();
        const user = await UserModel.findById(session.user.id);
        if (!user) {
            return NextResponse.json({ error: 'Nie znaleziono użytkownika' }, { status: 404 });
        }

        const wishlistField = itemType === 'batch' ? 'batchWishlist' : 'wishlist';

        if (!user[wishlistField]) {
            user[wishlistField] = [];
        }

        const index = user[wishlistField].indexOf(itemId);
        let updatedUser;

        if (index > -1) {
            user[wishlistField].splice(index, 1);
            updatedUser = await user.save();
            return NextResponse.json({ message: "Usunięto z ulubionych", [wishlistField]: updatedUser[wishlistField] });
        } else {
            user[wishlistField].push(itemId);
            updatedUser = await user.save();
            return NextResponse.json({ message: "Dodano do ulubionych", [wishlistField]: updatedUser[wishlistField] });
        }

    } catch (error) {
        console.error("Błąd podczas aktualizacji wishlisty:", error);
        return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
    }
}