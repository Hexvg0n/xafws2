import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/models/Product';

// --- FUNKCJA POST (TWORZENIE NOWEGO PRODUKTU) ---
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, sourceUrl, shopInfo } = body;

        if (!name || !sourceUrl) {
            return NextResponse.json({ error: 'Nazwa i link do produktu są wymagane.' }, { status: 400 });
        }

        await dbConnect();
        const newProduct = await ProductModel.create({
            name,
            sourceUrl,
            shopInfo,
            createdBy: session.user.id,
            // W przyszłości można tu dodać więcej pól z body
        });

        return NextResponse.json(newProduct, { status: 201 });

    } catch (error) {
        // Sprawdzanie, czy błąd to duplikat klucza (unikalny sourceUrl)
        if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
            return NextResponse.json({ error: 'Produkt z tym linkiem już istnieje w bazie.' }, { status: 409 });
        }
        
        const errorMessage = error instanceof Error ? error.message : 'Wystąpił błąd serwera.';
        console.error("Błąd podczas tworzenia produktu:", error);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

// --- FUNKCJA GET (POBIERANIE LISTY PRODUKTÓW) ---
export async function GET() {
    try {
        await dbConnect();
        const products = await ProductModel.find({}).sort({ createdAt: -1 });
        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Błąd serwera podczas pobierania produktów.' }, { status: 500 });
    }
}