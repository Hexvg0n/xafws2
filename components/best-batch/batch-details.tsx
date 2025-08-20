// components/best-batch/batch-details.tsx

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession, signIn } from "next-auth/react";
import {
  ShoppingCart,
  Heart,
  ChevronLeft,
  Ruler,
  Palette,
  Store,
  Loader2,
  AlertTriangle,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DOMPurify from 'isomorphic-dompurify';
import { useWishlist } from "../context/WishlistProvider";
import { usePreferences } from "../context/PreferencesProvider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Batch } from "@/lib/types";

export function BatchDetails({ batch }: { batch: Batch }) {
  const [selectedImage, setSelectedImage] = useState(batch.thumbnailUrl || batch.mainImages?.[0] || "/placeholder.svg");
  const { data: session } = useSession();
  const { wishlist, toggleFavorite } = useWishlist();
  const { convertPrice, generateAgentLink } = usePreferences();
  
  const [isFavorited, setIsFavorited] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [isLoadingLink, setIsLoadingLink] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  useEffect(() => {
    setIsFavorited(wishlist.batches.some((item: any) => item._id === batch._id));
  }, [wishlist, batch._id]);

  const handleFavoriteClick = async () => {
    if (!session) {
      setShowLoginAlert(true);
      return;
    }
    setIsFavoriteLoading(true);
    await toggleFavorite(batch, 'batch');
    setIsFavoriteLoading(false);
  };

  const handleBuyClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoadingLink(true);
    const link = await generateAgentLink(batch.sourceUrl);
    window.open(link, '_blank');
    setIsLoadingLink(false);
  };

  const sanitizedDescriptionHTML = batch.description ? DOMPurify.sanitize(batch.description) : null;
  const allImages = [batch.thumbnailUrl, ...batch.mainImages].filter(Boolean) as string[];

  return (
    <>
      <AlertDialog open={showLoginAlert} onOpenChange={setShowLoginAlert}>
        <AlertDialogContent className="glass-morphism text-white border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle className="text-yellow-400"/>Wymagane logowanie</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Musisz być zalogowany, aby dodać produkt do ulubionych. Zaloguj się przez Discord, aby kontynuować.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-white/80 hover:bg-white/10">Anuluj</AlertDialogCancel>
            <AlertDialogAction className="bg-emerald-500 hover:bg-emerald-600" onClick={() => signIn('discord')}>Zaloguj się</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/bb">
            <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Powrót do Best Batches
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-4">
            <motion.div key={selectedImage} initial={{ opacity: 0.8 }} animate={{ opacity: 1 }} className="glass-morphism rounded-2xl p-2">
              <div className="aspect-square bg-white/5 rounded-xl overflow-hidden">
                <Image src={selectedImage} alt={batch.name} width={800} height={800} className="w-full h-full object-cover" />
              </div>
            </motion.div>
            {allImages.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {allImages.map((image, index) => (
                  <button key={index} onClick={() => setSelectedImage(image)} className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${selectedImage === image ? "border-emerald-400" : "border-white/10 hover:border-white/30"}`}>
                    <Image src={image} alt={`${batch.name} ${index + 1}`} width={150} height={150} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-morphism rounded-2xl p-8">
              {batch.batch && (
                  <div className="flex items-center gap-2 mb-2 text-lg font-semibold text-blue-400">
                      <Star className="w-5 h-5 fill-current" />
                      <span>{batch.batch}</span>
                  </div>
              )}
              <h1 className="text-3xl font-bold text-white mb-3">{batch.name}</h1>
              <div className="flex items-center gap-2 mb-4 text-sm text-white/70"><Store className="w-4 h-4 text-emerald-400" /> <span>{batch.shopInfo?.ShopName || 'Brak danych'}</span></div>
              <div className="text-4xl font-bold text-emerald-400 mb-2">{batch.priceCNY} ¥</div>
              <div className="text-xl font-medium text-white/70 mb-6">≈ {convertPrice(batch.priceCNY)}</div>
              
              {batch.availableSizes && batch.availableSizes.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-white font-medium mb-3 flex items-center gap-2"><Ruler className="w-4 h-4"/> Dostępne rozmiary</h3>
                  <div className="flex flex-wrap gap-2">
                    {batch.availableSizes.map((size: string) => <Badge key={size} variant="secondary">{size}</Badge>)}
                  </div>
                </div>
              )}
              {batch.availableColors && batch.availableColors.length > 0 && (
                 <div className="mb-6">
                  <h3 className="text-white font-medium mb-3 flex items-center gap-2"><Palette className="w-4 h-4"/> Dostępne kolory</h3>
                  <div className="flex flex-wrap gap-2">
                    {batch.availableColors.map((color: string) => <Badge key={color} variant="secondary">{color}</Badge>)}
                  </div>
                </div>
              )}
              
              <div className="flex space-x-3">
                <Button onClick={handleBuyClick} disabled={isLoadingLink} size="lg" className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-400">
                  {isLoadingLink ? <Loader2 className="w-5 h-5 animate-spin"/> : <ShoppingCart className="w-5 h-5 mr-2" />}
                  Kup teraz
                </Button>
                <Button size="lg" variant="outline" className="border-white/20 text-white" onClick={handleFavoriteClick} disabled={isFavoriteLoading}>
                  {isFavoriteLoading ? <Loader2 className="w-5 h-5 animate-spin"/> : <Heart className={`w-5 h-5 ${isFavorited ? 'text-red-500 fill-current' : ''}`} />}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
        {sanitizedDescriptionHTML && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-morphism rounded-2xl p-8 mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Opis od sprzedawcy</h2>
            <div className="prose prose-sm md:prose-base prose-invert max-w-none [&_img]:rounded-lg" dangerouslySetInnerHTML={{ __html: sanitizedDescriptionHTML }} />
          </motion.div>
        )}
      </div>
    </>
  );
}