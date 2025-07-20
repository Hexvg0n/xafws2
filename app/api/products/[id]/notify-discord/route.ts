// app/api/products/[id]/notify-discord/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/models/Product';
import axios from 'axios';
import mongoose from 'mongoose';

type RouteContext = {
    params: {
        id: string;
    }
}

export async function POST(_req: Request, context: RouteContext) {
    const { id } = context.params;
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
        return NextResponse.json({ error: 'Webhook URL nie jest skonfigurowany na serwerze.' }, { status: 500 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: 'Nieprawidłowy format ID produktu.' }, { status: 400 });
    }

    try {
        await dbConnect();
        const product = await ProductModel.findById(id);

        if (!product) {
            return NextResponse.json({ error: 'Produkt nie został znaleziony.' }, { status: 404 });
        }
        
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

        // ZMIANA: Uproszczona struktura wiadomości "embed"
        const embed = {
            // Tytuł wiadomości, który jest jednocześnie linkiem do produktu na Twojej stronie
            title: product.name,
            url: `${siteUrl}/product/${product._id}`, // Link do konwersji
            color: 0x5865F2, // Kolor Discorda
            
            // Główne zdjęcie produktu
            image: {
                url: product.thumbnailUrl.startsWith('http') 
                    ? product.thumbnailUrl 
                    : `${siteUrl}${product.thumbnailUrl}` 
            },

            // Jedyne pole, jakie zostawiamy, to cena
            fields: [
                { name: 'Cena', value: `${product.priceCNY} CNY`, inline: false },
            ],
            
            timestamp: new Date().toISOString(),
        };

        const payload = {
            thread_name: product.name,
            embeds: [embed],
        };

        await axios.post(webhookUrl, payload);

        return NextResponse.json({ message: 'Powiadomienie wysłane na Discorda!' });

    } catch (error: any) {
        if (error.response) {
            console.error("Błąd od Discord API:", error.response.data);
        } else {
            console.error("Błąd podczas wysyłania na Discorda:", error);
        }
        return NextResponse.json({ error: 'Wystąpił błąd serwera.' }, { status: 500 });
    }
}