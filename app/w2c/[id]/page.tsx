// app/w2c/[id]/page.tsx

import Link from 'next/link';
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { ExternalLink, Repeat } from "lucide-react";
import type { Product } from '@/lib/types'; // Ponownie, upewnij się, że typ jest poprawny

interface ProductPageProps {
    params: {
        id: string;
    }
}

// Funkcja do pobierania danych pojedynczego produktu na serwerze
async function getProductById(id: string): Promise<Product | null> {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${siteUrl}/api/products/${id}`, { cache: 'no-store' });
    if (!response.ok) {
        return null;
    }
    return response.json();
}

export default async function ProductPage({ params }: ProductPageProps) {
    const product = await getProductById(params.id);

    if (!product) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold">Nie znaleziono produktu</h1>
                <p className="text-neutral-500 mt-2">Produkt o tym ID nie istnieje lub wystąpił błąd.</p>
                <Button asChild className="mt-6">
                    <Link href="/w2c">Wróć do katalogu</Link>
                </Button>
            </div>
        );
    }

    const allImages = [
        ...(product.thumbnailUrl ? [product.thumbnailUrl] : []),
        ...(product.mainImages || []),
        ...(product.descriptionImages || [])
    ];
    // Usuwamy duplikaty, jeśli thumbnail jest też w mainImages
    const uniqueImages = [...new Set(allImages)]; 

    return (
        <main className="container mx-auto px-4 py-8 md:py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {/* Galeria Zdjęć */}
                <div className="space-y-4">
                    {uniqueImages.map((imgSrc, index) => (
                        <div key={index} className="relative w-full aspect-square rounded-lg overflow-hidden glass-morphism">
                           <Image
                                src={imgSrc}
                                alt={`${product.name} - zdjęcie ${index + 1}`}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-contain"
                           />
                        </div>
                    ))}
                </div>

                {/* Informacje o Produkcie */}
                <div className="sticky top-24 h-fit">
                    <div className="glass-morphism p-6 rounded-xl text-white">
                        <Badge variant="secondary" className="mb-2">{product.platform}</Badge>
                        <h1 className="text-3xl lg:text-4xl font-bold gradient-text">{product.name}</h1>
                        <p className="text-3xl font-bold my-4">{product.priceCNY} CNY</p>
                        
                        <div className="space-y-4 my-6">
                            <div>
                                <h3 className="font-semibold mb-2">Sprzedawca:</h3>
                                <p className="text-neutral-300">{product.shopInfo?.shopName || 'Brak danych'}</p>
                            </div>
                             <div>
                                <h3 className="font-semibold mb-2">Dostępne style/kolory:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.availableColors.length > 0 ? product.availableColors.map(color => (
                                        <Badge key={color} variant="outline">{color}</Badge>
                                    )) : <p className="text-sm text-neutral-400">Brak danych</p>}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Dostępne rozmiary:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.availableSizes.length > 0 ? product.availableSizes.map(size => (
                                        <Badge key={size} variant="outline">{size}</Badge>
                                    )) : <p className="text-sm text-neutral-400">Brak danych</p>}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                            <Button asChild size="lg">
                                <a href={product.sourceUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="mr-2 h-4 w-4"/>
                                    Przejdź do źródła
                                </a>
                            </Button>
                            <Button asChild size="lg" variant="outline">
                                <Link href={`/converter?url=${encodeURIComponent(product.sourceUrl)}`}>
                                    <Repeat className="mr-2 h-4 w-4"/>
                                    Konwertuj link
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}