// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';
import axios from 'axios';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../auth/[...nextauth]/route';

// Funkcja zapewniająca, że folder do zapisu istnieje
async function ensureDirectoryExistence(filePath: string) {
    const dirname = path.dirname(filePath);
    try {
        await fs.access(dirname);
    } catch (e) {
        // Jeśli folder nie istnieje, utwórz go rekursywnie
        await fs.mkdir(dirname, { recursive: true });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
    }
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const imageUrl = formData.get('imageUrl') as string | null;

        let imageBuffer: Buffer;

        if (file) {
            console.log('Otrzymano plik:', file.name);
            const fileBuffer = await file.arrayBuffer();
            imageBuffer = Buffer.from(fileBuffer);
        } else if (imageUrl) {
            console.log('Otrzymano URL:', imageUrl);
            const response = await axios.get(imageUrl, {
                responseType: 'arraybuffer',
                headers: {
                    // Dodano User-Agent, aby uniknąć blokowania przez niektóre serwery
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            imageBuffer = Buffer.from(response.data, 'binary');
        } else {
            return NextResponse.json({ error: 'Nie dostarczono pliku ani URL.' }, { status: 400 });
        }

        console.log('Przetwarzanie obrazu za pomocą Sharp...');
        const processedImageBuffer = await sharp(imageBuffer)
            .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();
        console.log('Przetwarzanie obrazu zakończone.');

        // Zapisanie pliku na serwerze
        const filename = `product-${Date.now()}.webp`;
        const uploadsDir = path.join(process.cwd(), 'public/uploads');
        const filePath = path.join(uploadsDir, filename);
        
        // ----> LOG DO DEBUGOWANIA <----
        // Sprawdź w logach serwera, czy ta ścieżka jest poprawna
        console.log('Ścieżka zapisu pliku na serwerze:', filePath);

        await ensureDirectoryExistence(filePath);
        await fs.writeFile(filePath, processedImageBuffer);

        console.log('Plik zapisany pomyślnie.');

        // Zwrócenie publicznego URL do zapisanego pliku
        const publicUrl = `/uploads/${filename}`;

        // ----> LOG DO DEBUGOWANIA <----
        // Sprawdź, czy ten URL jest poprawnie zwracany do frontendu
        console.log('Zwracany publiczny URL:', publicUrl);

        return NextResponse.json({ thumbnailUrl: publicUrl });

    } catch (error) {
        // ----> LOG DO DEBUGOWANIA <----
        // Ten log pokaże dokładny błąd, jeśli wystąpi w bloku try
        console.error('Błąd podczas przesyłania obrazu:', error);
        return NextResponse.json({ error: 'Błąd serwera podczas przetwarzania obrazu.' }, { status: 500 });
    }
}