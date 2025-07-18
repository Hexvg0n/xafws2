// app/api/users/[id]/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

interface Params {
    params: { id: string }
}

export async function PATCH(req: Request, { params }: Params) {
    const session = await getServerSession(authOptions);
    const userIdToUpdate = params.id;
    const currentUserRole = session?.user?.role;
    
    // Tylko root i admin mogą modyfikować użytkowników
    if (!currentUserRole || !['root', 'admin'].includes(currentUserRole)) {
        return NextResponse.json({ error: "Brak dostępu" }, { status: 403 });
    }

    try {
        const body = await req.json();
        const { status } = body; // Można rozszerzyć o zmianę roli, hasła itp.

        if (!status) {
            return NextResponse.json({ error: "Brak statusu do aktualizacji" }, { status: 400 });
        }

        await dbConnect();

        const userToUpdate = await UserModel.findById(userIdToUpdate);

        if (!userToUpdate) {
            return NextResponse.json({ error: "Nie znaleziono użytkownika" }, { status: 404 });
        }

        // Admin nie może modyfikować roota
        if (userToUpdate.role === 'root' && currentUserRole !== 'root') {
             return NextResponse.json({ error: "Brak uprawnień do modyfikacji tego użytkownika" }, { status: 403 });
        }
        
        // Root może wszystko, admin może modyfikować tylko status
        if(currentUserRole === 'root' || (currentUserRole === 'admin' && body.status)) {
             userToUpdate.status = status;
        } else {
            return NextResponse.json({ error: "Niewystarczające uprawnienia do tej akcji" }, { status: 403 });
        }

        await userToUpdate.save();

        return NextResponse.json({ message: "Użytkownik zaktualizowany pomyślnie" }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    const userIdToDelete = params.id;

    // Krok 1: Tylko root może usuwać użytkowników
    if (session?.user?.role !== 'root') {
        return NextResponse.json({ error: "Brak uprawnień do wykonania tej akcji" }, { status: 403 });
    }

    // Krok 2: Root nie może usunąć sam siebie
    if (session.user.id === userIdToDelete) {
        return NextResponse.json({ error: "Nie możesz usunąć własnego konta" }, { status: 400 });
    }

    try {
        await dbConnect();
        
        const deletedUser = await UserModel.findByIdAndDelete(userIdToDelete);

        if (!deletedUser) {
            return NextResponse.json({ error: "Nie znaleziono użytkownika do usunięcia" }, { status: 404 });
        }

        // Opcjonalnie: Tutaj można dodać logikę do obsługi danych powiązanych z usuniętym użytkownikiem
        // np. przypisanie jego treści do innego użytkownika lub ich usunięcie.

        return NextResponse.json({ message: "Użytkownik został pomyślnie usunięty" }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Błąd serwera podczas usuwania użytkownika" }, { status: 500 });
    }
}