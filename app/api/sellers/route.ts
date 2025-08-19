// app/api/sellers/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Seller from '@/models/Seller';

// GET - Pobieranie wszystkich sprzedawców
export async function GET() {
    await dbConnect();
    try {
        const sellers = await Seller.find({}).sort({ name: 1 });
        return NextResponse.json(sellers);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching sellers' }, { status: 500 });
    }
}

// POST - Tworzenie nowego sprzedawcy
export async function POST(req: Request) {
    await dbConnect();
    try {
        const body = await req.json();
        const newSeller = new Seller(body);
        await newSeller.save();
        return NextResponse.json(newSeller, { status: 201 });
    } catch (error) {
        // Obsługa błędu duplikatu
        if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
            return NextResponse.json({ error: 'Sprzedawca o tej nazwie już istnieje.' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Error creating seller' }, { status: 400 });
    }
}