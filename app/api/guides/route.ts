// app/api/guides/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import GuideModel from '@/models/Guide';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { logHistory } from '@/lib/historyLogger';

// GET - Pobierz wszystkie poradniki
export async function GET() {
    await dbConnect();
    try {
        const guides = await GuideModel.find({}).sort({ createdAt: -1 });
        return NextResponse.json(guides);
    } catch (error) {
        return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
    }
}

// POST - Stwórz nowy poradnik
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user || !['admin', 'root'].includes(session.user.role)) {
        return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 });
    }

    await dbConnect();
    try {
        const body = await req.json();
        const newGuide = new GuideModel(body);
        await newGuide.save();
        
        await logHistory(session, 'add', 'guide', newGuide._id.toString(), `dodał poradnik "${newGuide.title}"`);

        return NextResponse.json(newGuide, { status: 201 });
    } catch (error) {
        if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
            return NextResponse.json({ error: 'Poradnik o tym tytule lub slugu już istnieje.' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Błąd podczas tworzenia poradnika' }, { status: 500 });
    }
}