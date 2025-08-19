// components/navbar.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut, signIn } from "next-auth/react";
import { Menu, X, User, LogOut, Shield, Loader2, Heart } from "lucide-react";
import { useWishlist } from "./context/WishlistProvider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Icons } from "@/components/ui/icons";

const navItems = [
  { name: "W2C", href: "/w2c" },
  { name: "Best Batch", href: "/best-batch" },
  { name: "Sellers", href: "/sellers" },
  { name: "Tools", href: "/tools" },
  { name: "How To", href: "/how-to" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { data: session } = useSession();
  const userRole = session?.user?.role;
  const { wishlist } = useWishlist();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogin = () => {
    setIsLoggingIn(true);
    signIn('discord', { callbackUrl: '/' });
  };

  const userInitial = session?.user?.name?.charAt(0).toUpperCase() || '?';

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/20 backdrop-blur-md border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="XaffReps Logo" width={140} height={40} className="h-auto" />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} className="text-white/70 hover:text-white transition-colors duration-200 font-medium relative group">
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-600 to-emerald-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-2">
            {session ? (
              <>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white/70 hover:text-white relative">
                      <Heart />
                      {wishlist.length > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">{wishlist.length}</span>
                      )}
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 glass-morphism border-white/20 text-white">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold">Ulubione</h4>
                      <Button asChild variant="link" className="p-0 h-auto text-emerald-400"><Link href="/profile">Zobacz wszystkie</Link></Button>
                    </div>
                    {wishlist.length > 0 ? (
                      <div className="space-y-3">
                        {wishlist.slice(0, 3).map(item => (
                          <Link href={`/w2c/${item._id}`} key={item._id} className="flex items-center gap-3 hover:bg-white/10 p-2 rounded-md transition-colors">
                            <Image src={item.thumbnailUrl || '/placeholder.svg'} alt={item.name} width={48} height={48} className="w-12 h-12 rounded-md object-cover"/>
                            <div className="flex-1 overflow-hidden">
                              <p className="text-sm font-medium truncate">{item.name}</p>
                              <p className="text-xs text-emerald-400">{item.priceCNY} ¥</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-white/60 text-center py-4">Twoja lista ulubionych jest pusta.</p>
                    )}
                  </HoverCardContent>
                </HoverCard>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                        <AvatarFallback>{userInitial}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{session.user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {(userRole === 'admin' || userRole === 'root' || userRole === 'adder') && (
                      <DropdownMenuItem asChild><Link href="/dashboard"><Shield className="mr-2 h-4 w-4" /><span>Panel</span></Link></DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild><Link href="/profile"><User className="mr-2 h-4 w-4" /><span>Profil</span></Link></DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}><LogOut className="mr-2 h-4 w-4" /><span>Wyloguj</span></DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={handleLogin} disabled={isLoggingIn} className="bg-gradient-to-r from-emerald-600 to-emerald-400 hover:from-emerald-700 hover:to-emerald-500">
                {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Icons.discord className="w-5 h-5 mr-2" />Zaloguj przez Discord</>}
              </Button>
            )}
          </div>
          <div className="md:hidden">
            {/* ZMIANA: Poprawiona składnia JSX */}
            <Button onClick={() => setIsOpen(!isOpen)} variant="ghost" size="sm" className="text-white/70 hover:text-white">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-black/90 backdrop-blur-md border-t border-white/10">
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <Link key={item.name} href={item.href} className="block text-white/70 hover:text-white transition-colors duration-200 font-medium py-2" onClick={() => setIsOpen(false)}>
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-white/10">
                {session ? (
                    <Button onClick={() => signOut({ callbackUrl: '/' })} className="w-full bg-red-600 hover:bg-red-700">
                      <LogOut className="w-4 h-4 mr-2" /> Wyloguj
                    </Button>
                ) : (
                    <Button onClick={handleLogin} disabled={isLoggingIn} className="w-full bg-gradient-to-r from-emerald-600 to-emerald-400">
                       {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Icons.discord className="w-5 h-5 mr-2" /> Zaloguj się przez Discord</>}
                    </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}