// app/api/setup/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
    await dbConnect();

    try {
        const userExists = await User.findOne({ nickname: 'root' });

        if (userExists) {
            return NextResponse.json({ message: 'Użytkownik root już istnieje.' }, { status: 409 });
        }

        // Ustaw tutaj silne hasło dla swojego konta root!
        const hashedPassword = await bcrypt.hash('Ma4Ta*Sy(Z^+)', 10);

        await User.create({
            nickname: 'root', // Ustawiamy nickname
            password: hashedPassword,
            role: 'root',
            status: 'aktywny' // Root jest aktywny od razu
        });

        return NextResponse.json({ message: 'Użytkownik root został pomyślnie utworzony.' }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}