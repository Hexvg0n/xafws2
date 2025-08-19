// app/api/currency/rates/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import CurrencyRateModel from '@/models/CurrencyRate';
import axios from 'axios';

const API_KEY = process.env.EXCHANGERATE_API_KEY; // Potrzebujesz darmowego klucza z https://www.exchangerate-api.com/
const BASE_CURRENCY = 'CNY';

// Endpoint do pobierania kursów przez frontend
export async function GET() {
    await dbConnect();
    try {
        let rates = await CurrencyRateModel.findOne({ base: BASE_CURRENCY });

        // Jeśli dane są starsze niż 24h lub nie istnieją, odśwież je
        if (!rates || (new Date().getTime() - new Date(rates.lastUpdated).getTime() > 24 * 60 * 60 * 1000)) {
            if (!API_KEY) {
                console.error("Brak klucza API do kursów walut.");
                return NextResponse.json(rates?.rates || {}, { status: 200 });
            }

            const response = await axios.get(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${BASE_CURRENCY}`);
            const newRates = response.data.conversion_rates;

            rates = await CurrencyRateModel.findOneAndUpdate(
                { base: BASE_CURRENCY },
                { rates: newRates, lastUpdated: new Date() },
                { upsert: true, new: true }
            );
        }
        
        return NextResponse.json(rates?.rates || {}, { status: 200 });

    } catch (error) {
        console.error("Błąd API kursów walut:", error);
        return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
    }
}