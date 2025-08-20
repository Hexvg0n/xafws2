// app/api/history/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import HistoryModel from '@/models/History';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'root') {
        return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 });
    }

    await dbConnect();
    try {
        const history = await HistoryModel.find({}).sort({ createdAt: -1 }).limit(100);
        return NextResponse.json(history);
    } catch (error) {
        return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
    }
}