"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, User, Percent, LogOut, Disc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { PromoHoverCard } from "@/components/promotions/promo-hover-card";

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
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">XR</span>
            </div>
            <span className="font-display font-bold text-xl gradient-text">XaffReps</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white/70 hover:text-white transition-colors duration-200 font-medium relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <Button 
                onClick={() => signOut({ callbackUrl: '/' })}
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Wyloguj
              </Button>
            ) : (
              <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200">
                <a href="https://discord.gg/xaffreps" target="_blank" rel="noopener noreferrer">
                  <Disc className="w-4 h-4 mr-2" />
                  Dołącz do Discorda
                </a>
              </Button>
            )}
          </div>

          <div className="md:hidden">
            <Button
              onClick={() => setIsOpen(!isOpen)}
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/90 backdrop-blur-md border-t border-white/10"
          >
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
                    <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-medium">
                       <a href="https://discord.gg/xaffreps" target="_blank" rel="noopener noreferrer">
                          <Disc className="w-4 h-4 mr-2" />
                          Dołącz do Discorda
                       </a>
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