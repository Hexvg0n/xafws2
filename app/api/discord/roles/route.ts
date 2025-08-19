// app/api/discord/roles/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
    const GUILD_ID = process.env.DISCORD_GUILD_ID;
    const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

    if (!GUILD_ID || !BOT_TOKEN) {
        return NextResponse.json({ error: 'Brak konfiguracji serwera Discord w zmiennych środowiskowych.' }, { status: 500 });
    }

    try {
        const response = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/roles`, {
            headers: {
                Authorization: `Bot ${BOT_TOKEN}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Błąd API Discorda:', errorData);
            throw new Error('Nie udało się pobrać ról. Sprawdź, czy token bota i ID serwera są poprawne.');
        }

        const roles = await response.json();
        // Filtrujemy role zarządzane przez boty (np. @everyone) i sortujemy
        const filteredRoles = roles
            .filter((role: any) => !role.managed && role.name !== '@everyone')
            .sort((a: any, b: any) => b.position - a.position);

        return NextResponse.json({ roles: filteredRoles }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}