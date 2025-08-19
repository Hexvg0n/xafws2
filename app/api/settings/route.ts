// app/api/settings/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import SettingsModel from '@/models/Settings';

// GET - Pobieranie aktualnych ustawień
export async function GET() {
    await dbConnect();
    try {
        const settings = await SettingsModel.findOne({ key: 'discordRoles' });
        // Zwróć puste stringi, jeśli ustawienia jeszcze nie istnieją
        if (!settings) {
            return NextResponse.json({ rootRoleId: '', adminRoleId: '', adderRoleId: '' }, { status: 200 });
        }
        return NextResponse.json(settings, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Błąd serwera podczas pobierania ustawień.' }, { status: 500 });
    }
}

// POST - Zapisywanie/aktualizacja ustawień
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'root') {
        return NextResponse.json({ error: 'Brak uprawnień. Tylko root może zmieniać te ustawienia.' }, { status: 403 });
    }

    try {
        const { rootRoleId, adminRoleId, adderRoleId } = await req.json();
        if (!rootRoleId || !adminRoleId || !adderRoleId) {
            return NextResponse.json({ error: 'Wszystkie trzy ID ról są wymagane.' }, { status: 400 });
        }

        await dbConnect();

        const settings = await SettingsModel.findOneAndUpdate(
            { key: 'discordRoles' },
            { rootRoleId, adminRoleId, adderRoleId },
            { new: true, upsert: true, runValidators: true }
        );

        return NextResponse.json({ message: 'Ustawienia ról zostały zapisane.', settings }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: 'Błąd serwera podczas zapisywania ustawień.' }, { status: 500 });
    }
}