"use client"

import { useState } from "react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Copy, Check, AlertTriangle, Link2, Sparkles } from "lucide-react"

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

export default function LinkConverterPage() {
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
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  }

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  }

  return (
  <main className="flex justify-center p-4 sm:p-8 md:p-12 mt-14">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-3xl space-y-8"
      >
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-white/10 border border-white/20 shadow-xl">
              <Link2 className="h-10 w-10 text-sky-300" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight gradient-text">
            Konwerter Linków
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
            Wklej link z Taobao, Weidian, 1688 lub od agenta, a my wygenerujemy dla Ciebie linki do wszystkich
            popularnych platform.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-morphism p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="url"
              placeholder="https://item.taobao.com/item.htm?id=..."
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="flex-grow text-base bg-slate-800/60 border-slate-700 focus:ring-blue-700 focus:border-blue-700 text-white placeholder:text-slate-500 h-14 px-4"
              disabled={isLoading}
              onKeyDown={(e) => e.key === "Enter" && !isLoading && handleConvert()}
            />
            <Button
              onClick={handleConvert}
              disabled={isLoading}
              size="lg"
              className="w-full sm:w-auto text-base font-semibold bg-gradient-to-r from-[hsl(236,91%,55%)] to-[hsl(236,91%,55%)]  text-white shadow-lg shadow-sky-500/20 transition-all duration-300 ease-in-out h-14 px-8"
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
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-center text-sm text-red-400 flex items-center justify-center gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              {error}
            </motion.p>
          )}
        </motion.div>

        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="space-y-6"
            >
              <div className="glass-morphism p-6 text-white">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Link2 className="h-5 w-5 text-sky-400" />
                  <span className="text-[#b0fcf5]">Oryginalny Link</span>
                </h3>
                <div className="flex items-center gap-3 bg-black/20 p-3 rounded-lg border border-slate-800">
                  <a
                    href={results.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-sky-300 transition-colors break-all text-sm"
                  >
                    {results.originalUrl}
                  </a>
                </div>
              </div>

              <div className="glass-morphism p-6 text-white">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-sky-500" />
                  <span className="text-[#b0fcf5]">Linki Pośredników</span>
                </h3>
                <ul className="space-y-3">
                  {results.convertedLinks.map((link) => (
                    <li
                      key={link.key}
                      className="p-4 border border-slate-800 bg-slate-900/50 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:border-sky-500/50 hover:bg-sky-900/20"
                    >
                      <div className="flex-grow">
                        <p className="font-semibold text-white">{link.name}</p>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-400 hover:text-sky-300 transition-colors break-all"
                        >
                          {link.url}
                        </a>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(link.url)}
                        className="w-full sm:w-auto text-slate-400 hover:bg-slate-700 hover:text-white self-start sm:self-center px-4 py-2"
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          <motion.span
                            key={copiedLink === link.url ? "copied" : "copy"}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center"
                          >
                            {copiedLink === link.url ? (
                              <>
                                <Check className="mr-2 h-4 w-4 text-green-400" /> Skopiowano
                              </>
                            ) : (
                              <>
                                <Copy className="mr-2 h-4 w-4" /> Kopiuj
                              </>
                            )}
                          </motion.span>
                        </AnimatePresence>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  )
}
