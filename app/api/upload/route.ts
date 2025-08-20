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
            // Opcja 1: Przesłano plik
            const fileBuffer = await file.arrayBuffer();
            imageBuffer = Buffer.from(fileBuffer);
        } else if (imageUrl) {
            // Opcja 2: Podano URL
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            imageBuffer = Buffer.from(response.data, 'binary');
        } else {
            return NextResponse.json({ error: 'Nie dostarczono pliku ani URL.' }, { status: 400 });
        }

        const processedImageBuffer = await sharp(imageBuffer)
            .resize(800, 800, { fit: 'inside', withoutEnlargement: true }) // Zmień rozmiar, jeśli potrzebujesz
            .webp({ quality: 80 }) // Konwersja do WebP z jakością 80%
            .toBuffer();

        // Zapisanie pliku na serwerze
        const filename = `product-${Date.now()}.webp`;
        const uploadsDir = path.join(process.cwd(), 'public/uploads');
        const filePath = path.join(uploadsDir, filename);
        
        await ensureDirectoryExistence(filePath);
        await fs.writeFile(filePath, processedImageBuffer);

        // Zwrócenie publicznego URL do zapisanego pliku
        const publicUrl = `/uploads/${filename}`;

        return NextResponse.json({ thumbnailUrl: publicUrl });

    } catch (error) {
        console.error('Błąd podczas przesyłania obrazu:', error);
        return NextResponse.json({ error: 'Błąd serwera podczas przetwarzania obrazu.' }, { status: 500 });
    }
}