// app/api/users/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import bcrypt from 'bcryptjs';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../auth/[...nextauth]/route';

// Funkcja GET do pobierania listy użytkowników
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    
    if (!session || !['admin', 'root'].includes(session.user?.role || '')) {
        return NextResponse.json({ error: 'Brak dostępu' }, { status: 403 });
    }

    await dbConnect();

    try {
        let query: any = {};

        // Filtracja po statusie (np. dla zakładki "Zatwierdź Użytkowników")
        if (status) {
            query.status = status;
        }

        // *** KLUCZOWA ZMIANA LOGIKI FILTROWANIA ***
        // Jeśli zalogowany użytkownik to 'admin', pokaż mu tylko użytkowników z rolą 'adder'.
        // Root w tym warunku nie jest uwzględniony, więc zobaczy wszystkich użytkowników pasujących do 'query'.
        if (session.user.role === 'admin') {
            query.role = 'adder';
        }
        
        // Root nie powinien widzieć samego siebie na liście do zarządzania
        if (session.user.role === 'root') {
            query._id = { $ne: session.user.id };
        }

        const users = await UserModel.find(query).select('-password').sort({ createdAt: -1 });
        
        return NextResponse.json(users, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: 'Błąd serwera.' }, { status: 500 });
    }
}


// Funkcja POST do tworzenia nowych użytkowników (pozostaje bez zmian)
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
    }
    
    if (session.user.role !== 'root' && session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Brak dostępu' }, { status: 403 });
    }

    try {
        const { nickname, password, role } = await req.json();

        if (!nickname || !password || !role) {
            return NextResponse.json({ error: 'Wszystkie pola są wymagane: pseudonim, hasło, rola.' }, { status: 400 });
        }

        await dbConnect();
        const existingUser = await UserModel.findOne({ nickname });
        if (existingUser) {
            return NextResponse.json({ error: 'Użytkownik o podanym pseudonimie już istnieje.' }, { status: 409 });
        }

        if (session.user.role === 'admin' && (role === 'admin' || role === 'root')) {
            return NextResponse.json({ error: 'Admin nie może tworzyć użytkowników o równych lub wyższych uprawnieniach.' }, { status: 403 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        
        const newUserStatus = session.user.role === 'root' ? 'aktywny' : 'oczekujący';
        const message = session.user.role === 'root' 
            ? 'Użytkownik został dodany i jest aktywny.' 
            : 'Prośba o utworzenie użytkownika została wysłana do roota.';

        const newUser = await UserModel.create({
            nickname,
            password: hashedPassword,
            role,
            status: newUserStatus,
            createdBy: session.user.id,
        });

        const userResponse = {
            id: newUser._id,
            nickname: newUser.nickname,
            role: newUser.role,
            status: newUser.status
        };

        return NextResponse.json({ message, user: userResponse }, { status: 201 });

    } catch (error) {
        console.error('Błąd podczas tworzenia użytkownika:', error);
        return NextResponse.json({ error: 'Wystąpił błąd serwera.' }, { status: 500 });
    }
}