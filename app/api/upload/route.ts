// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../auth/[...nextauth]/route';

// Konfiguracja Cloudinary przy użyciu zmiennych środowiskowych
// Te klucze są bezpieczne, ponieważ ten kod wykonuje się tylko na serwerze.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(req: Request) {
    // === SEKCJA 1: UWIERZYTELNIANIE I AUTORYZACJA ===
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role;

    // Sprawdzamy, czy użytkownik jest zalogowany i ma odpowiednią rolę
    if (!session || !userRole || !['admin', 'root', 'adder'].includes(userRole)) {
        return NextResponse.json({ error: 'Brak uprawnień do przesyłania plików.' }, { status: 403 }); // 403 Forbidden
    }

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const imageUrl = formData.get('imageUrl') as string | null;

        let uploadResult;

        // === SEKCJA 2: PRZETWARZANIE I WYSYŁANIE PLIKU ===
        if (file) {
            // --- DODATKOWE ZABEZPIECZENIE: Sprawdzenie rozmiaru pliku ---
            const MAX_FILE_SIZE_MB = 5;
            if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                return NextResponse.json({ error: `Plik jest za duży. Maksymalny rozmiar to ${MAX_FILE_SIZE_MB} MB.` }, { status: 413 }); // 413 Payload Too Large
            }

            // Jeśli przesyłamy plik, zamieniamy go na bufor i wysyłamy do Cloudinary
            const fileBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(fileBuffer);
            
            uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: "xaffreps_products", // Opcjonalnie: folder w Cloudinary do organizacji
                        resource_type: "auto", // Automatycznie wykryj typ pliku
                    },
                    (error, result) => {
                        if (error) {
                            console.error("Błąd streamu Cloudinary:", error);
                            reject(error);
                        };
                        resolve(result);
                    }
                );
                uploadStream.end(buffer);
            });

        } else if (imageUrl) {
            // Jeśli mamy URL, Cloudinary może pobrać obrazek bezpośrednio z tego linku
            uploadResult = await cloudinary.uploader.upload(imageUrl, {
                folder: "xaffreps_products",
                resource_type: "image",
            });
        } else {
            return NextResponse.json({ error: 'Nie dostarczono pliku ani URL.' }, { status: 400 });
        }

        // === SEKCJA 3: ZWROT ODPOWIEDZI ===
        // Cloudinary zwraca obiekt z wieloma informacjami, w tym bezpiecznym URL
        const secureUrl = (uploadResult as any)?.secure_url;

        if (!secureUrl) {
            throw new Error("Nie udało się uzyskać bezpiecznego URL z Cloudinary po pomyślnym przesłaniu.");
        }

        return NextResponse.json({ thumbnailUrl: secureUrl });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Wystąpił nieznany błąd";
        console.error('Błąd podczas przesyłania obrazu do Cloudinary:', errorMessage);
        return NextResponse.json({ error: 'Błąd serwera podczas przetwarzania obrazu.' }, { status: 500 });
    }
}