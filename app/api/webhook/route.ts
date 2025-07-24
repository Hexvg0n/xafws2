// app/api/webhook/route.ts

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
    const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
    if (!WEBHOOK_URL) {
        return NextResponse.json({ error: 'Webhook URL nie jest skonfigurowany.' }, { status: 500 });
    }

    try {
        const { productName, action, user, sourceUrl } = await req.json();
        if (!productName || !action || !user) {
            return NextResponse.json({ error: 'Brak wymaganych danych dla webhooka.' }, { status: 400 });
        }

        let color = 0x808080; // Domyślnie szary
        let actionText = '';

        switch(action) {
            case 'add':
                color = 0x2ECC71; // Zielony
                actionText = 'dodał nowy produkt';
                break;
            case 'edit':
                color = 0x3498DB; // Niebieski
                actionText = 'zedytował produkt';
                break;
            case 'delete':
                color = 0xE74C3C; // Czerwony
                actionText = 'usunął produkt';
                break;
        }

        const embed = {
            title: `Akcja w panelu: Produkt`,
            description: `Użytkownik **${user}** ${actionText}: **${productName}**`,
            color: color,
            fields: sourceUrl ? [{ name: "Link do produktu", value: sourceUrl }] : [],
            timestamp: new Date().toISOString(),
        };

        await axios.post(WEBHOOK_URL, {
            username: "XaffReps Panel Log",
            embeds: [embed],
        });

        return NextResponse.json({ message: 'Webhook wysłany.' }, { status: 200 });

    } catch (error) {
        console.error("Błąd wysyłania webhooka:", error);
        return NextResponse.json({ error: 'Błąd serwera.' }, { status: 500 });
    }
}