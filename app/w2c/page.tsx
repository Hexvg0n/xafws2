"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Eye, Heart, ExternalLink, Loader2, Package } from "lucide-react";
import type { Product } from '@/lib/types';

export default function W2CPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/products');
                if (!response.ok) throw new Error("Failed to fetch products");
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleFavoriteClick = (productId: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        alert(`Dodano do ulubionych produkt o ID: ${productId}! (Logika do zaimplementowania)`);
        // TODO: Wywołaj API, aby zapisać polubienie w bazie danych
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <main className="container mx-auto px-4 py-8 md:py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold gradient-text">Katalog Produktów</h1>
                <p className="mt-4 text-neutral-400 max-w-xl mx-auto">
                    Przeglądaj najnowsze produkty dodane przez naszą społeczność.
                </p>
            </div>

            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <Link href={`/w2c/${product._id}`} key={product._id} className="group relative aspect-[4/5] overflow-hidden rounded-xl block">
                            {/* Warstwa 1: Zdjęcie */}
                            <Image
                                src={product.thumbnailUrl || product.mainImages?.[0] || '/placeholder.png'}
                                alt={product.name}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                            />
                            
                            {/* Warstwa 2: Kontener na tekst i przyciski */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex flex-col justify-end">
                                
                                {/* Kontener z tekstem - animuje się (przesuwa w górę) */}
                                <div className="transition-transform duration-300 ease-in-out transform group-hover:-translate-y-1">
                                    <h3 className="font-bold text-lg text-white truncate">
                                        {product.name}
                                    </h3>
                                    <div className="flex justify-between items-center mt-2 text-sm text-neutral-300">
                                        <p className="font-light text-base text-white">{product.priceCNY} CNY</p>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1">
                                                <Eye className="h-4 w-4" />
                                                <span>{product.views || 0}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Heart className="h-4 w-4" />
                                                <span>{product.favorites || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Kontener z przyciskami - wysuwa się i staje się widoczny */}
                                <div className="transition-all duration-300 ease-in-out max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 group-hover:pt-4">
                                    <div className="flex items-center justify-center gap-4">
                                       <Button asChild size="sm" className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white" onClick={(e) => e.stopPropagation()}>
                                            <Link href={`/w2c/${product._id}`}>
                                                <ExternalLink className="mr-2 h-4 w-4" />
                                                Zobacz
                                            </Link>
                                       </Button>
                                       <Button size="sm" variant="outline" className="w-1/2" onClick={(e) => handleFavoriteClick(product._id, e)}>
                                            <Heart className="mr-2 h-4 w-4" />
                                            Ulubione
                                       </Button>
                                    </div>
                                </div>

                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 glass-morphism rounded-xl">
                    <Package className="h-12 w-12 mx-auto text-neutral-500" />
                    <h3 className="mt-4 text-xl font-semibold text-white">Brak produktów w katalogu</h3>
                    <p className="mt-2 text-neutral-400">Dodaj nowy produkt w panelu admina, aby pojawił się tutaj.</p>
                </div>
            )}
        </main>
    );
}