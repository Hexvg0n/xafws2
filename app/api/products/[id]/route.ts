// app/api/products/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/models/Product';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { revalidatePath } from 'next/cache'; // <-- Ważny import do odświeżania cache

// Konfiguracja Cloudinary (upewnij się, że masz te zmienne w .env.local)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Funkcja pomocnicza do wyciągania public_id z URL Cloudinary
const getPublicIdFromUrl = (url: string) => {
  try {
    const parts = url.split('/');
    const publicIdWithExtension = parts.slice(-2).join('/');
    const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));
    return publicId;
  } catch (e) {
    console.error("Nie udało się sparsować public_id z URL:", url);
    return null;
  }
};


// --- FUNKCJA PATCH (EDYCJA) ---
// Ta funkcja pozostaje bez zmian
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    // ... twój istniejący kod PATCH
    const session = await getServerSession(authOptions);
    if (!session?.user || !['admin', 'root'].includes(session.user.role)) {
        return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 });
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
        return NextResponse.json({ error: "Nieprawidłowy identyfikator produktu" }, { status: 400 });
    }

    try {
        const body = await req.json();
        await dbConnect();
        
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            params.id,
            body,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return NextResponse.json({ error: "Nie znaleziono produktu." }, { status: 404 });
        }

        return NextResponse.json(updatedProduct, { status: 200 });

    } catch (error) {
        console.error("Błąd podczas aktualizacji produktu:", error);
        return NextResponse.json({ error: 'Błąd serwera.' }, { status: 500 });
    }
}


// --- FUNKCJA DELETE (USUWANIE) - ZAKTUALIZOWANA LOGIKA ---
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !['admin', 'root'].includes(session.user.role)) {
        return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 });
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
        return NextResponse.json({ error: "Nieprawidłowy identyfikator produktu" }, { status: 400 });
    }

    try {
        await dbConnect();
        
        // Znajdź produkt PRZED usunięciem, aby uzyskać URL do zdjęcia
        const productToDelete = await ProductModel.findById(params.id);

        if (!productToDelete) {
            return NextResponse.json({ error: "Nie znaleziono produktu do usunięcia." }, { status: 404 });
        }

        // KROK 1: Usuń obrazek z Cloudinary, jeśli istnieje
        if (productToDelete.thumbnailUrl && productToDelete.thumbnailUrl.includes('cloudinary')) {
            const publicId = getPublicIdFromUrl(productToDelete.thumbnailUrl);
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            }
        }
        
        // KROK 2: Usuń produkt z bazy danych
        await ProductModel.findByIdAndDelete(params.id);

        // KROK 3: Odśwież cache dla strony głównej
        revalidatePath('/'); // Mówi Next.js, żeby pobrał świeże dane dla strony głównej    

        return NextResponse.json({ message: "Produkt i powiązane zdjęcie zostały pomyślnie usunięte." }, { status: 200 });

    } catch (error) {
        console.error("Błąd podczas usuwania produktu:", error);
        return NextResponse.json({ error: 'Błąd serwera.' }, { status: 500 });
    }
}