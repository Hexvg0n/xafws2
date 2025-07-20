"use client"

import { useState } from "react"
// ZMIANA 1: Usunięto 'AnimatePresence', nie będzie już potrzebne
import { motion, Variants } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Copy, Check, AlertTriangle, Link2 } from "lucide-react"

// Definicje typów dla danych z API
interface ConvertedLink {
  key: string
  name: string
  url: string
}

interface ConversionResults {
  originalUrl: string
  convertedLinks: ConvertedLink[]
}

export function LinkConverter() {
  const [inputUrl, setInputUrl] = useState("")
  const [results, setResults] = useState<ConversionResults | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedLink, setCopiedLink] = useState<string | null>(null)

  const handleConvert = async () => {
    if (!inputUrl.trim()) {
      setError("Proszę wkleić link do konwersji.")
      return
    }
    setIsLoading(true)
    setError(null)
    setResults(null)
    try {
      const response = await fetch("/api/converter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputUrl }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Wystąpił nieznany błąd serwera.")
      }
      setResults(data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedLink(url)
    setTimeout(() => setCopiedLink(null), 2000)
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="w-full max-w-3xl space-y-8">
      <motion.div variants={itemVariants} className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text">Konwerter Linków</h1>
        <p className="mt-4 text-neutral-400 max-w-xl mx-auto">
          Wklej link z Taobao, Weidian, 1688 lub od agenta, a my wygenerujemy dla Ciebie linki do wszystkich popularnych
          platform.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="glass-morphism p-6 rounded-xl">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            type="url"
            placeholder="https://item.taobao.com/item.htm?id=..."
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="flex-grow text-base bg-neutral-900/50 border-neutral-700 focus:ring-blue-500 focus:ring-offset-neutral-900 text-white placeholder:text-neutral-500 h-12"
            disabled={isLoading}
          />
          <div className="w-full sm:w-auto p-[1px] rounded-lg bg-gradient-to-r from-blue-600 to-blue-400">
            <Button
              onClick={handleConvert}
              disabled={isLoading}
              size="lg"
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white h-12 text-base font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <span>Konwertuję...</span>
                </>
              ) : (
                "Konwertuj Link"
              )}
            </Button>
          </div>
        </div>
        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center text-sm text-red-400 flex items-center justify-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </motion.p>
        )}
      </motion.div>

      {/* ZMIANA 2: Usunęliśmy AnimatePresence i uprościliśmy logikę animacji */}
      {results && (
        <motion.div
          // Używamy tego samego wariantu, co inne elementy na stronie
          variants={itemVariants}
          className="space-y-6"
        >
          <div className="glass-morphism p-6 rounded-xl text-white">
            <h3 className="font-semibold text-lg mb-2">Oryginalny Link</h3>
            <div className="flex items-center gap-3 bg-neutral-900/50 p-3 rounded-lg">
              <Link2 className="h-5 w-5 text-blue-400 flex-shrink-0" />
              <a
                href={results.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors break-all text-sm"
              >
                {results.originalUrl}
              </a>
            </div>
          </div>

          <div className="glass-morphism p-6 rounded-xl text-white">
            <h3 className="font-semibold text-lg mb-4">Linki Pośredników</h3>
            <ul className="space-y-4">
              {results.convertedLinks.map((link) => (
                <li
                  key={link.key}
                  className="p-4 border border-neutral-800 bg-neutral-900/50 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="flex-grow">
                    <p className="font-semibold text-white">{link.name}</p>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors break-all"
                    >
                      {link.url}
                    </a>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(link.url)}
                    className="w-full sm:w-auto text-neutral-300 hover:bg-neutral-700 hover:text-white self-start sm:self-center"
                  >
                     {/* Uproszczona wersja przycisku kopiowania bez AnimatePresence dla spójności */}
                     {copiedLink === link.url ? (
                        <>
                          <Check className="mr-2 h-4 w-4 text-green-400" />
                          Skopiowano
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Kopiuj
                        </>
                      )}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}