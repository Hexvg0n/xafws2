// app/api/qc/route.ts (teraz służy do pobierania danych produktu)

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
    try {
        const { url } = await req.json();
        if (!url) {
            return NextResponse.json({ error: 'URL jest wymagany.' }, { status: 400 });
        }

        // Zmieniamy URL na ten do pobierania danych produktu
        const encodedUrl = encodeURIComponent(url);
        const apiResponse = await axios.get(`https://dev.vectoreps.pl/api/api/link-parser?url=${encodedUrl}`);
        
        const data = apiResponse.data;

        // Sprawdzamy, czy odpowiedź z API jest poprawna
        if (apiResponse.status !== 200 || !data.ItemID) {
            const errorMessage = data.error || "Nie udało się pobrać danych dla tego linku.";
            return NextResponse.json({ error: errorMessage }, { status: 404 });
        }

        // Zwracamy wszystkie pobrane dane
        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.error("Błąd w API /api/qc (product-data):", error);
        return NextResponse.json({ error: 'Wystąpił wewnętrzny błąd serwera.' }, { status: 500 });
    }
}