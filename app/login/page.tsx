"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Disc, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [isDiscordLoading, setIsDiscordLoading] = useState(false);

  const handleDiscordSignIn = () => {
    setIsDiscordLoading(true);
    signIn('discord', { callbackUrl: '/dashboard' });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d0d0d] to-[#1a1a1a] p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-morphism rounded-2xl p-8 space-y-6 text-center">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Witaj w XaffReps</h1>
            <p className="text-white/70">Zaloguj się przez Discord, aby kontynuować</p>
          </div>

          <Button
            type="button"
            onClick={handleDiscordSignIn}
            disabled={isDiscordLoading}
            className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center text-base h-12"
          >
            {isDiscordLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <>
                    <Disc className="w-5 h-5 mr-2" /> Zaloguj się przez Discord
                </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}