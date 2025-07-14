"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Link2, Copy, ArrowRight, Check, ExternalLink, RefreshCw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AgentLink {
  name: string
  url: string
  fee: string
  rating: number
  features: string[]
  color: string
}

interface ConvertedLinks {
  originalUrl: string
  productInfo?: {
    title?: string
    price?: string
    seller?: string
    image?: string
    platform?: string
  }
  agentLinks: AgentLink[]
  error?: string
}

const agents: AgentLink[] = [
  {
    name: "Pandabuy",
    url: "https://pandabuy.com/product?url=",
    fee: "5%",
    rating: 4.8,
    features: ["Darmowe QC", "Szybka wysyłka", "24/7 Support"],
    color: "bg-purple-500",
  },
  {
    name: "Wegobuy",
    url: "https://wegobuy.com/en/page/buy?url=",
    fee: "6%",
    rating: 4.6,
    features: ["Profesjonalne QC", "Ubezpieczenie", "Consolidation"],
    color: "bg-blue-500",
  },
  {
    name: "Sugargoo",
    url: "https://sugargoo.com/index/item/index.html?tp=taobao&url=",
    fee: "4%",
    rating: 4.7,
    features: ["Niskie opłaty", "Szybkie QC", "Expert Service"],
    color: "bg-green-500",
  },
  {
    name: "CSSBuy",
    url: "https://cssbuy.com/item-",
    fee: "5%",
    rating: 4.5,
    features: ["Stare doświadczenie", "Dobre ceny", "Reliable"],
    color: "bg-orange-500",
  },
  {
    name: "Superbuy",
    url: "https://superbuy.com/en/page/buy?url=",
    fee: "7%",
    rating: 4.4,
    features: ["Premium service", "Expert QC", "Insurance"],
    color: "bg-red-500",
  },
  {
    name: "Basetao",
    url: "https://basetao.com/shopping?url=",
    fee: "5%",
    rating: 4.3,
    features: ["Competitive rates", "Good support", "Fast processing"],
    color: "bg-indigo-500",
  },
]

export function LinkConverter() {
  const [productLink, setProductLink] = useState("")
  const [isConverting, setIsConverting] = useState(false)
  const [result, setResult] = useState<ConvertedLinks | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const convertLink = async () => {
    if (!productLink.trim()) return

    setIsConverting(true)
    setError(null)

    try {
      const response = await fetch("/api/converter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: productLink }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Błąd serwera: ${response.status}`)
      }

      const data: ConvertedLinks = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Dodaj pełne URL-e do agentów
      const resultWithAgentLinks: ConvertedLinks = {
        ...data,
        agentLinks: agents.map((agent) => ({
          ...agent,
          url: agent.url + encodeURIComponent(productLink),
        })),
      }

      setResult(resultWithAgentLinks)
    } catch (err) {
      setError((err as Error).message || "Wystąpił nieoczekiwany błąd")
    } finally {
      setIsConverting(false)
    }
  }

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="glass-morphism rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-white mb-6">Wklej link do produktu</h2>

        <div className="space-y-4">
          <div className="relative">
            <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            <input
              type="url"
              value={productLink}
              onChange={(e) => setProductLink(e.target.value)}
              placeholder="https://item.taobao.com/item.htm?id=... lub https://weidian.com/..."
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="text-sm text-white/60">
            <p className="mb-2">Obsługiwane platformy:</p>
            <div className="flex flex-wrap gap-2">
              {["Taobao", "Weidian", "1688", "Tmall", "Yupoo"].map((platform) => (
                <span key={platform} className="px-2 py-1 bg-white/10 rounded text-xs">
                  {platform}
                </span>
              ))}
            </div>
          </div>

          <Button
            onClick={convertLink}
            disabled={!productLink.trim() || isConverting}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500"
          >
            {isConverting ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Konwertuję na agentów...
              </>
            ) : (
              <>
                <ArrowRight className="w-4 h-4 mr-2" />
                Konwertuj na Agentów
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-morphism rounded-2xl p-6 border border-red-400/30"
        >
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-400" />
            <div>
              <h3 className="text-lg font-semibold text-red-400">Błąd konwersji</h3>
              <p className="text-white/70">{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Product Info */}
          {result.productInfo && (
            <div className="glass-morphism rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-white mb-6">Informacje o produkcie</h3>
              <div className="flex items-center space-x-6">
                {result.productInfo.image && (
                  <img
                    src={result.productInfo.image || "/placeholder.svg"}
                    alt={result.productInfo.title || "Produkt"}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-white mb-2">
                    {result.productInfo.title || "Nieznany produkt"}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-white/60">
                    {result.productInfo.platform && <span>Platforma: {result.productInfo.platform}</span>}
                    {result.productInfo.seller && <span>Sprzedawca: {result.productInfo.seller}</span>}
                    {result.productInfo.price && (
                      <span className="text-blue-400 font-bold text-lg">{result.productInfo.price}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Agent Links */}
          <div className="glass-morphism rounded-2xl p-8">
            <h3 className="text-xl font-semibold text-white mb-6">Linki do agentów ({agents.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {result.agentLinks.map((agent, index) => (
                <motion.div
                  key={agent.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${agent.color}`} />
                      <h4 className="text-lg font-semibold text-white">{agent.name}</h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full ${
                              i < Math.floor(agent.rating) ? "bg-yellow-400" : "bg-gray-600"
                            }`}
                          />
                        ))}
                        <span className="text-white/60 text-sm ml-1">{agent.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-white/60 text-sm mb-2">Opłata serwisowa: {agent.fee}</div>
                    <div className="flex flex-wrap gap-1">
                      {agent.features.map((feature, featureIndex) => (
                        <span
                          key={featureIndex}
                          className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded border border-blue-500/30"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={agent.url}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/70 text-xs"
                    />
                    <Button
                      size="sm"
                      onClick={() => copyToClipboard(agent.url, index)}
                      className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500"
                    >
                      {copiedIndex === index ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(agent.url, "_blank")}
                      className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Comparison Table */}
          <div className="glass-morphism rounded-2xl p-8">
            <h3 className="text-xl font-semibold text-white mb-6">Porównanie agentów</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-white/80 py-3">Agent</th>
                    <th className="text-left text-white/80 py-3">Opłata</th>
                    <th className="text-left text-white/80 py-3">Ocena</th>
                    <th className="text-left text-white/80 py-3">Główne cechy</th>
                  </tr>
                </thead>
                <tbody>
                  {result.agentLinks.map((agent, index) => (
                    <tr key={index} className="border-b border-white/5">
                      <td className="py-3">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${agent.color}`} />
                          <span className="text-white">{agent.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-white/70">{agent.fee}</td>
                      <td className="py-3 text-white/70">{agent.rating}/5</td>
                      <td className="py-3 text-white/70">{agent.features[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tips */}
          <div className="glass-morphism rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Wskazówki wyboru agenta</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                Porównaj opłaty serwisowe - różnią się między agentami
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                Sprawdź jakość QC zdjęć w opiniach użytkowników
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                Wybierz agenta z dobrym wsparciem w Twoim języku
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                Zwróć uwagę na czas przetwarzania zamówień
              </li>
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  )
}
