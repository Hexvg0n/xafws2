// app/api/discord/roles/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET() {
    const session = await getServerSession(authOptions);
    // Tylko root może pobrać listę ról
    if (session?.user?.role !== 'root') {
        return NextResponse.json({ error: 'Brak uprawnień.' }, { status: 403 });
    }

    const GUILD_ID = process.env.DISCORD_GUILD_ID;
    const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN; // Potrzebujemy tokenu bota!

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
            throw new Error('Nie udało się pobrać ról z API Discorda.');
        }

        const roles = await response.json();
        // Sortujemy role od najwyższej do najniższej, tak jak w Discordzie
        const sortedRoles = roles.sort((a: any, b: any) => b.position - a.position);

        return NextResponse.json({ roles: sortedRoles }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}