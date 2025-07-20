import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/models/Product';
import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Przetwarza dane z API w sposób elastyczny, obsługując dowolne nazwy wariantów.
 * Ta funkcja jest wywoływana przez endpoint POST.
 */
function processApiData(data: any) {
    // Przetwarzanie obrazów z opisu
    let descriptionImages: string[] = [];
    if (data.Description) {
        const $ = cheerio.load(data.Description);
        descriptionImages = $('img').map((_i, el) => $(el).attr('src')).get().filter(src => !!src);
    }

    // Przetwarzanie wariantów na podstawie POZYCJI w tablicy
    const colorsSet = new Set<string>();
    const sizesSet = new Set<string>();

    if (Array.isArray(data.Skus)) {
        for (const sku of data.Skus) {
            // Sprawdzamy, czy tablica 'Properties' istnieje i ma co najmniej 2 elementy
            if (Array.isArray(sku.Properties) && sku.Properties.length >= 2) {
                
                // Pierwszy obiekt to "kolor"
                const colorObject = sku.Properties[0];
                if (colorObject && typeof colorObject.Value !== 'undefined') {
                    colorsSet.add(colorObject.Value);
                }

                // Drugi obiekt to "rozmiar"
                const sizeObject = sku.Properties[1];
                if (sizeObject && typeof sizeObject.Value !== 'undefined') {
                    sizesSet.add(sizeObject.Value);
                }
            }
        }
    }

    // Złożenie finalnego obiektu do zapisu
    const processed = {
        mainImages: data.Images || [],
        descriptionImages: descriptionImages,
        priceCNY: data.PriceCNY || data.Price || 0,
        shopInfo: data.ShopInfo || {},
        availableColors: Array.from(colorsSet),
        availableSizes: Array.from(sizesSet),
    };

    return processed;
}

/**
 * Endpoint POST do tworzenia nowego produktu.
 */
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
    }

    try {
        await dbConnect();
        const body = await req.json();
        const { sourceUrl, name, thumbnailUrl } = body; 

        if (!sourceUrl || !name || !thumbnailUrl) {
            return NextResponse.json({ error: 'Nazwa, link oraz miniaturka są wymagane.' }, { status: 400 });
        }

        const existingProduct = await ProductModel.findOne({ sourceUrl });
        if (existingProduct) {
            return NextResponse.json({ error: 'Produkt z tego linku już istnieje.' }, { status: 409 });
        }

        const apiResponse = await axios.get(`https://api.repmafia.net/preview?url=${encodeURIComponent(sourceUrl)}`);
        if (!apiResponse.data || apiResponse.data.Error) {
            throw new Error(apiResponse.data.Error || "Zewnętrzne API zwróciło błąd.");
        }
        const apiData = apiResponse.data;

        let platform: string | undefined;
        if (sourceUrl.includes('1688.com')) platform = '1688';
        else if (sourceUrl.includes('taobao.com') || sourceUrl.includes('tmall.com')) platform = 'Taobao';
        else if (sourceUrl.includes('weidian.com')) platform = 'Weidian';
        else {
          platform = apiData.Platform;
        }

        if (!platform) {
            return NextResponse.json({ error: 'Nie udało się zidentyfikować platformy z linku.' }, { status: 400 });
        }

        const processedData = processApiData(apiData);

        const productToSave = {
            name,
            sourceUrl,
            thumbnailUrl,
            platform,
            ...processedData,
            createdBy: session.user.id,
        };

        const newProduct = await ProductModel.create(productToSave);

        return NextResponse.json(newProduct, { status: 201 });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Wystąpił nieznany błąd serwera.';
        console.error("Błąd podczas tworzenia produktu:", error);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

/**
 * Endpoint GET do pobierania listy wszystkich produktów.
 */
export async function GET(_req: Request) {
    try {
        await dbConnect();
        const products = await ProductModel.find({}).sort({ createdAt: -1 });
        return NextResponse.json(products);
    } catch (error) {
        console.error("Błąd podczas pobierania produktów:", error);
        return NextResponse.json({ error: 'Błąd serwera podczas pobierania produktów' }, { status: 500 });
    }
}