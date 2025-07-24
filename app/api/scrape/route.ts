// app/api/scrape/route.ts

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
    try {
        const { url } = await req.json();
        if (!url) {
            return NextResponse.json({ error: 'Link jest wymagany.' }, { status: 400 });
        }

        const apiResponse = await axios.get(`https://api.repmafia.net/preview?url=${encodeURIComponent(url)}`);
        
        if (!apiResponse.data || apiResponse.data.Error) {
            throw new Error(apiResponse.data.Error || "API repmafia.net zwróciło błąd.");
        }

        // Zwracamy tylko potrzebne dane do formularza
        const { Title, ShopInfo } = apiResponse.data;
        return NextResponse.json({ name: Title, shopInfo: ShopInfo }, { status: 200 });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Wystąpił błąd serwera.';
        console.error("Błąd podczas scrapowania:", error);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}