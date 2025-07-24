// app/unauthorized/page.tsx

"use client"; // <--- DODAJ TĘ LINIĘ NA SAMEJ GÓRZE

import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d0d0d] to-[#1a1a1a] p-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-morphism rounded-2xl p-8 max-w-lg"
      >
        <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-white mb-4">Brak Dostępu</h1>
        <p className="text-white/70 mb-8">
          Twoje konto Discord nie posiada odpowiednich ról na naszym serwerze, aby uzyskać dostęp do tej zawartości. 
          Skontaktuj się z administratorem, jeśli uważasz, że to pomyłka.
        </p>
        <div className="flex justify-center space-x-4">
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                <Link href="/">Powrót na stronę główną</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500">
                <a href="https://discord.gg/xaffreps" target="_blank" rel="noopener noreferrer">Dołącz do serwera</a>
            </Button>
        </div>
      </motion.div>
    </div>
  );
}