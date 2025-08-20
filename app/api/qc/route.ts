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

        if (apiResponse.status !== 200) {
            const errorMessage = data.error || "Nie udało się pobrać danych dla tego linku.";
            return NextResponse.json({ error: errorMessage }, { status: apiResponse.status });
        }

        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.error("Błąd w API /api/qc:", error);
        return NextResponse.json({ error: 'Wystąpił wewnętrzny błąd serwera.' }, { status: 500 });
    }
}