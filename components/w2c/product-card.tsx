"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import { ShoppingCart, Heart, Eye, ImageOff, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface ProductCardProps {
  product: any;
  viewMode: "grid" | "list";
  isFavorited: boolean;
  onToggleFavorite: (product: any) => void;
}

const PlaceholderImage = () => (
    <div className="aspect-square w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-900/20 to-emerald-600/20 group-hover:from-emerald-900/30 group-hover:to-emerald-600/30 transition-all duration-300">
        <ImageOff className="w-10 h-10 text-emerald-500/40" />
    </div>
);

export function ProductCard({ product, viewMode, isFavorited, onToggleFavorite }: ProductCardProps) {
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const [isLoadingLink, setIsLoadingLink] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const { data: session } = useSession();
  const { convertPrice, generateAgentLink } = usePreferences();

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!session) {
      setShowLoginAlert(true);
      return;
    }
    setIsLoadingFavorite(true);
    await onToggleFavorite(product);
    setIsLoadingFavorite(false);
  };

  const handleBuyClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsLoadingLink(true);
    try {
      const link = await generateAgentLink(product.sourceUrl);
      window.open(link, '_blank');
    } catch (error) {
      console.error("Błąd generowania linku agenta", error);
      alert("Wystąpił błąd podczas generowania linku.");
    } finally {
      setIsLoadingLink(false);
    }
  };
  
  const sellerName = product.shopInfo?.ShopName || 'Nieznany';
  
  const ProductImage = () => (
    product.thumbnailUrl ? (
        <Image src={product.thumbnailUrl} alt={product.name} width={300} height={300} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
    ) : <PlaceholderImage />
  );

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

      {viewMode === "list" ? (
        <motion.div whileHover={{ y: -5 }} className="glass-morphism rounded-2xl p-6 hover:bg-white/10">
          <div className="flex items-center space-x-6">
              <Link href={`/w2c/${product._id}`} className="block flex-shrink-0">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-white/5"><ProductImage /></div>
              </Link>
              <div className="flex-1 min-w-0">
                  <Link href={`/w2c/${product._id}`}><h3 className="text-xl font-semibold text-white mb-2 hover:text-emerald-400 truncate">{product.name}</h3></Link>
                  <p className="text-sm text-white/60 mb-3">by {sellerName}</p>
                   <div className="flex items-center space-x-4 text-white/70 text-sm">
                      <div className="flex items-center space-x-1.5"><Heart className="w-4 h-4 text-red-400/70" /> <span>{product.favorites || 0}</span></div>
                      <div className="flex items-center space-x-1.5"><Eye className="w-4 h-4" /> <span>{product.views || 0}</span></div>
                  </div>
              </div>
               <div className="text-right flex flex-col items-end justify-between">
                  <div className="text-2xl font-bold text-emerald-400 mb-4">{convertPrice(product.priceCNY || 0)}</div>
                  <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={handleFavoriteClick} disabled={isLoadingFavorite}>
                          {isLoadingFavorite ? <Loader2 className="w-4 h-4 animate-spin"/> : <Heart className={`w-4 h-4 transition-colors ${isFavorited ? 'text-red-500 fill-current' : 'text-white/60'}`} />}
                      </Button>
                      <Button onClick={handleBuyClick} disabled={isLoadingLink} size="sm" className="bg-gradient-to-r from-emerald-600 to-emerald-400">
                          {isLoadingLink ? <Loader2 className="w-4 h-4 animate-spin"/> : <ShoppingCart className="w-4 h-4 mr-2" />}
                          Kup teraz
                      </Button>
                  </div>
              </div>
          </div>
        </motion.div>
      ) : (
        <motion.div whileHover={{ y: -8 }} className="glass-morphism rounded-2xl overflow-hidden h-full flex flex-col">
          <Link href={`/w2c/${product._id}`} className="cursor-pointer">
            <div className="relative aspect-square"><ProductImage /></div>
          </Link>
          <div className="p-6 flex flex-col flex-grow">
            <Link href={`/w2c/${product._id}`}><h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3></Link>
            <p className="text-white/60 mb-3">{sellerName}</p>
            <div className="flex-grow" />
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-4 text-white/70 text-sm">
                    <div className="flex items-center space-x-1.5"><Heart className="w-4 h-4 text-red-400/70" /> <span>{product.favorites || 0}</span></div>
                    <div className="flex items-center space-x-1.5"><Eye className="w-4 h-4" /> <span>{product.views || 0}</span></div>
                </div>
                <div className="text-xl font-bold text-emerald-400">{convertPrice(product.priceCNY || 0)}</div>
            </div>
            <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-white/10">
              <Button size="sm" variant="ghost" className="text-white/60" onClick={handleFavoriteClick} disabled={isLoadingFavorite}>
                {isLoadingFavorite ? <Loader2 className="w-4 h-4 animate-spin"/> : <Heart className={`w-4 h-4 ${isFavorited ? 'text-red-500 fill-current' : 'text-white/60'}`} />}
              </Button>
              <Button onClick={handleBuyClick} disabled={isLoadingLink} size="sm" className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-400">
                {isLoadingLink ? <Loader2 className="w-4 h-4 animate-spin"/> : <ShoppingCart className="w-4 h-4 mr-2" />}
                Kup teraz
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}