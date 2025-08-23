// app/api/batches/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import BatchModel from '@/models/Batch';
import mongoose from "mongoose";
import { v2 as cloudinary } from 'cloudinary';
import { revalidatePath } from 'next/cache'; // <-- Ważny import

// Konfiguracja Cloudinary
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
    if (!session?.user || !['admin', 'root', 'adder'].includes(session.user.role)) {
        return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 });
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
        return NextResponse.json({ error: "Nieprawidłowy identyfikator partii" }, { status: 400 });
    }

    try {
        const body = await req.json();
        await dbConnect();
        
        const updatedBatch = await BatchModel.findByIdAndUpdate(
            params.id,
            body,
            { new: true, runValidators: true }
        );

        if (!updatedBatch) {
            return NextResponse.json({ error: "Nie znaleziono batcha." }, { status: 404 });
        }

        return NextResponse.json(updatedBatch, { status: 200 });

    } catch (error) {
        console.error("Błąd podczas aktualizacji batcha:", error);
        return NextResponse.json({ error: 'Błąd serwera.' }, { status: 500 });
    }
}

// --- FUNKCJA DELETE (USUWANIE) - ZAKTUALIZOWANA LOGIKA ---
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
     if (!session?.user || !['admin', 'root', 'adder'].includes(session.user.role)) {
        return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 });
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
        return NextResponse.json({ error: "Nieprawidłowy identyfikator partii" }, { status: 400 });
    }

    try {
        await dbConnect();

        // Znajdź batch PRZED usunięciem
        const batchToDelete = await BatchModel.findById(params.id);

        if (!batchToDelete) {
            return NextResponse.json({ error: "Nie znaleziono batcha do usunięcia." }, { status: 404 });
        }
        
        // KROK 1: Usuń obrazek z Cloudinary
        if (batchToDelete.thumbnailUrl && batchToDelete.thumbnailUrl.includes('cloudinary')) {
            const publicId = getPublicIdFromUrl(batchToDelete.thumbnailUrl);
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            }
        }

        // KROK 2: Usuń batch z bazy danych
        await BatchModel.findByIdAndDelete(params.id);
        
        // KROK 3: Odśwież cache strony głównej
        revalidatePath('/');

        return NextResponse.json({ message: "Batch został pomyślnie usunięty." }, { status: 200 });

    } catch (error) {
        console.error("Błąd podczas usuwania batcha:", error);
        return NextResponse.json({ error: 'Błąd serwera.' }, { status: 500 });
    }
}