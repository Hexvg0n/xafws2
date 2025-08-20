// app/api/batches/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import BatchModel from '@/models/Batch';
import axios from 'axios';

// Funkcja pomocnicza do parsowania URL
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

// --- FUNKCJA POST (TWORZENIE NOWEGO BATCHA) ---
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
    }

    try {
        const manualData = await req.json();
        const { name, sourceUrl, thumbnailUrl, category, batch } = manualData; 

        if (!name || !sourceUrl || !batch) {
            return NextResponse.json({ error: 'Nazwa, link i nazwa batcha są wymagane.' }, { status: 400 });
        }

        let apiDataToSave = {};
        try {
            const parsedLink = parseProductLink(sourceUrl);
            if (!parsedLink) {
                throw new Error("Nie udało się zidentyfikować platformy lub ID produktu z podanego linku.");
            }

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
        } catch (apiError) {
            console.warn("Nie udało się pobrać dodatkowych danych z API, produkt zostanie zapisany z danymi podstawowymi.", apiError);
        }

        await dbConnect();
        
        const newBatch = await BatchModel.create({
            ...apiDataToSave,
            name,
            sourceUrl,
            thumbnailUrl,
            category: category || null,
            batch,
            createdBy: session.user.id,
        });

        return NextResponse.json(newBatch, { status: 201 });

    } catch (error) {
        if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
            return NextResponse.json({ error: 'Produkt z tym linkiem już istnieje w bazie.' }, { status: 409 });
        }
        
        const errorMessage = error instanceof Error ? error.message : 'Wystąpił błąd serwera.';
        console.error("Błąd podczas tworzenia batcha:", error);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

// --- FUNKCJA GET ---
export async function GET() {
    try {
        await dbConnect();
        const batches = await BatchModel.find({}).sort({ createdAt: -1 });
        return NextResponse.json(batches, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Błąd serwera podczas pobierania batchy.' }, { status: 500 });
    }
}