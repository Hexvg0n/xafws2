// app/api/products/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/models/Product';
import axios from 'axios';
import * as cheerio from 'cheerio';

// --- FUNKCJA DO PRZETWARZANIA DANYCH Z API REPMIAFIA ---
function processApiData(data: any, platform: string) {
    const processed: any = {
        platform,
        mainImages: data.Images || [],
        priceCNY: data.PriceCNY || 0,
        shopInfo: {
            shopName: data.ShopInfo?.ShopName,
            shopLogo: data.ShopInfo?.ShopLogo,
            shopId: data.ShopInfo?.ShopID,
        },
        dimensions: data.Dimensions || {},
        skus: data.Skus || [], // Zapisujemy całą surową listę SKU
    };

    // Wyciąganie linków do obrazów z opisu (Description)
    if (data.Description) {
        const $ = cheerio.load(data.Description);
        processed.descriptionImages = $('img').map((i, el) => $(el).attr('src')).get();
    }

    // Wyciąganie unikalnych kolorów i rozmiarów z SKU
    const colors = new Set<string>();
    const sizes = new Set<string>();

    if (data.Skus) {
        data.Skus.forEach((sku: any) => {
            sku.Properties.forEach((prop: any) => {
                if (prop.Name.toLowerCase().includes('color')) {
                    colors.add(prop.Value);
                }
                if (prop.Name.toLowerCase().includes('size')) {
                    sizes.add(prop.Value);
                }
            });
        });
    }

    processed.availableColors = Array.from(colors);
    processed.availableSizes = Array.from(sizes);

    return processed;
}

// --- GŁÓWNA LOGIKA ENDPOINTU ---
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
    }

    try {
        const { sourceUrl } = await req.json();
        if (!sourceUrl) {
            return NextResponse.json({ error: 'Link do produktu jest wymagany.' }, { status: 400 });
        }

        // 1. Wywołujemy Twoje API repmafia.net
        console.log(`Odpytywanie API repmafia.net dla: ${sourceUrl}`);
        const apiResponse = await axios.get(`https://api.repmafia.net/preview?url=${encodeURIComponent(sourceUrl)}`);
        
        if (!apiResponse.data || apiResponse.data.Error) {
            throw new Error(apiResponse.data.Error || "API repmafia.net zwróciło błąd.");
        }
        
        const apiData = apiResponse.data;

        // 2. Przetwarzamy otrzymane dane
        const platform = sourceUrl.includes('1688.com') ? '1688' : sourceUrl.includes('taobao.com') ? 'Taobao' : 'Weidian';
        const processedData = processApiData(apiData, platform);

        // 3. Zapisujemy do naszej bazy danych
        const productToSave = {
            name: apiData.Title, // Nazwę bierzemy bezpośrednio z API
            sourceUrl,
            ...processedData,
            createdBy: session.user.id,
        };

        await dbConnect();
        const newProduct = await ProductModel.create(productToSave);

        return NextResponse.json(newProduct, { status: 201 });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Wystąpił błąd serwera.';
        console.error("Błąd podczas tworzenia produktu:", error);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}