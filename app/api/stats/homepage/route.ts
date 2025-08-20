// app/api/stats/homepage/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/models/Product';
import BatchModel from '@/models/Batch';
import SellerModel from '@/models/Seller';
import axios from 'axios';

// Cache do przechowywania danych przez 1 godzinę
let cachedStats: any = null;
let lastFetch: number = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 godzina w milisekundach

export async function GET() {
    const now = Date.now();

    // Zwróć dane z cache, jeśli są aktualne
    if (cachedStats && (now - lastFetch < CACHE_DURATION)) {
        return NextResponse.json(cachedStats);
    }

    await dbConnect();

    try {
        // Pobieranie danych z Discord API
        const GUILD_ID = process.env.DISCORD_GUILD_ID;
        const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
        let memberCount = 0;

        if (GUILD_ID && BOT_TOKEN) {
            try {
                const response = await axios.get(`https://discord.com/api/v10/guilds/${GUILD_ID}?with_counts=true`, {
                    headers: { Authorization: `Bot ${BOT_TOKEN}` },
                });
                memberCount = response.data.approximate_member_count || 0;
            } catch (discordError) {
                console.error("Błąd podczas pobierania danych z Discorda:", discordError);
                // W razie błędu, nie przerywamy działania, zwrócimy 0
            }
        }

        // Pobieranie danych z bazy danych
        const [totalProducts, totalBatches, totalSellers] = await Promise.all([
            ProductModel.countDocuments(),
            BatchModel.countDocuments(),
            SellerModel.countDocuments()
        ]);

        const stats = {
            memberCount,
            totalItems: totalProducts + totalBatches,
            totalSellers,
        };

        // Zapisz nowe dane do cache
        cachedStats = stats;
        lastFetch = now;

        return NextResponse.json(stats);

    } catch (error) {
        console.error("Błąd podczas pobierania statystyk na stronę główną:", error);
        return NextResponse.json({ error: 'Błąd serwera podczas pobierania statystyk.' }, { status: 500 });
    }
}