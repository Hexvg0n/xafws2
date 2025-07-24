// app/api/qc/route.ts

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
    try {
        const { url } = await req.json();
        if (!url) {
            return NextResponse.json({ error: 'URL jest wymagany.' }, { status: 400 });
        }

        const encodedUrl = encodeURIComponent(url);
        const apiResponse = await axios.get(`https://dev.vectoreps.pl/api/api/qc?url=${encodedUrl}`);
        
        const data = apiResponse.data;

        if (!data.success || !data.cnfans || data.cnfans.cnfans !== "sukces") {
            // Próbujemy znaleźć bardziej szczegółowy błąd, jeśli istnieje
            const errorMessage = data.error || data.cnfans?.qc_data?.msg || "Nie znaleziono zdjęć QC dla tego linku.";
            return NextResponse.json({ error: errorMessage }, { status: 404 });
        }

        // Zwracamy tylko te dane, które są nam potrzebne
        return NextResponse.json(data.cnfans.qc_data.data, { status: 200 });

    } catch (error) {
        console.error("Błąd w API /api/qc:", error);
        return NextResponse.json({ error: 'Wystąpił wewnętrzny błąd serwera.' }, { status: 500 });
    }
}