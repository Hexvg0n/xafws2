// app/api/products/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/models/Product';
import axios from 'axios';
import { logHistory } from '@/lib/historyLogger'; // <<< Nowy import

// Funkcja pomocnicza do parsowania URL (bez zmian)
const parseProductLink = (url: string): { platform: string; itemID: string } | null => {
    try {
        const urlObj = new URL(url);
        let platform = '';
        let itemID = '';

        if (urlObj.hostname.includes('taobao')) {
            platform = 'taobao';
            itemID = urlObj.searchParams.get('id') || '';
        } else if (urlObj.hostname.includes('weidian')) {
            platform = 'weidian';
            itemID = urlObj.searchParams.get('itemID') || '';
        } else if (urlObj.hostname.includes('1688')) {
            platform = '1688';
            const match = urlObj.pathname.match(/offer\/(\d+)\.html/);
            if (match) itemID = match[1];
        }

        if (platform && itemID) {
            return { platform, itemID };
        }
        return null;
    } catch (e) {
        return null;
    }
}

// --- FUNKCJA POST (TWORZENIE NOWEGO PRODUKTU) ---
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session.user.name) { // Dodano sprawdzenie session.user.name
        return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
    }

    try {
        const manualData = await req.json();
        const { name, sourceUrl, thumbnailUrl, category } = manualData; 

        if (!name || !sourceUrl) {
            return NextResponse.json({ error: 'Nazwa i link do produktu są wymagane.' }, { status: 400 });
        }

        let apiDataToSave = {};
        try {
            const parsedLink = parseProductLink(sourceUrl);
            if (parsedLink) {
                const apiUrl = `https://api.repmafia.net/preview?url=${parsedLink.platform}/${parsedLink.itemID}`;
                const apiResponse = await axios.get(apiUrl);
                
                if (apiResponse.status === 200 && apiResponse.data.ItemID) {
                    const apiResult = apiResponse.data;
                    
                    const colors = new Set<string>();
                    const sizes = new Set<string>();
                    
                    if (apiResult.Skus && Array.isArray(apiResult.Skus)) {
                        apiResult.Skus.forEach((sku: any) => {
                            if (sku.Properties && Array.isArray(sku.Properties)) {
                                sku.Properties.forEach((prop: { Name: string; Value: string }) => {
                                    if (prop.Name.toLowerCase().includes('color')) {
                                        colors.add(prop.Value.trim());
                                    } else if (prop.Name.toLowerCase().includes('size')) {
                                        sizes.add(prop.Value.trim());
                                    }
                                });
                            }
                        });
                    }
                    
                    apiDataToSave = {
                        platform: apiResult.Platform,
                        mainImages: apiResult.Images || [],
                        description: apiResult.Description,
                        priceCNY: apiResult.Price,
                        shopInfo: apiResult.ShopInfo,
                        dimensions: apiResult.Dimensions,
                        skus: apiResult.Skus || [],
                        availableColors: Array.from(colors),
                        availableSizes: Array.from(sizes),
                    };
                }
            }
        } catch (apiError) {
            console.warn("Nie udało się pobrać dodatkowych danych z API, produkt zostanie zapisany z danymi podstawowymi.", apiError);
        }

        await dbConnect();
        
        const newProduct = await ProductModel.create({
            ...apiDataToSave,
            name,
            sourceUrl,
            thumbnailUrl,
            category: category || null, 
            createdBy: session.user.id,
        });

        // <<< DODANE LOGOWANIE DO HISTORII >>>
        await logHistory(session, 'add', 'product', newProduct._id.toString(), `dodał produkt "${newProduct.name}"`);

        return NextResponse.json(newProduct, { status: 201 });

    } catch (error) {
        if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
            return NextResponse.json({ error: 'Produkt z tym linkiem już istnieje w bazie.' }, { status: 409 });
        }
        
        const errorMessage = error instanceof Error ? error.message : 'Wystąpił błąd serwera.';
        console.error("Błąd podczas tworzenia produktu:", error);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

// --- FUNKCJA GET (bez zmian) ---
export async function GET() {
    try {
        await dbConnect();
        const products = await ProductModel.find({}).sort({ createdAt: -1 });
        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Błąd serwera podczas pobierania produktów.' }, { status: 500 });
    }
}