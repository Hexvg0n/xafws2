"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Link2, Search, Star, Download, Eye, AlertTriangle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface QCGroup {
  id: string
  name: string
  images: string[]
  analysis: {
    overallScore: number
    lighting: number
    clarity: number
    angles: number
    details: number
  }
  recommendations: string[]
  flaws: string[]
}

interface QCResult {
  groups: QCGroup[]
  overallScore: number
  totalImages: number
}

export function QCChecker() {
  const [qcLink, setQcLink] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<QCResult | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)

  const analyzeQC = async () => {
    if (!qcLink.trim()) return

    setIsAnalyzing(true)

    // Symulacja analizy QC z linku
    setTimeout(() => {
      const mockResult: QCResult = {
        groups: [
          {
            id: "front-views",
            name: "Widoki z przodu",
            images: [
              "/placeholder.svg?height=400&width=400",
              "/placeholder.svg?height=400&width=400",
              "/placeholder.svg?height=400&width=400",
            ],
            analysis: {
              overallScore: 8.5,
              lighting: 9.0,
              clarity: 8.5,
              angles: 8.0,
              details: 8.5,
            },
            recommendations: ["Dodaj zdjęcie z boku", "Pokaż logo z bliska"],
            flaws: ["Niewielka nierówność szwu", "Lekko asymetryczne logo"],
          },
          {
            id: "side-views",
            name: "Widoki z boku",
            images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
            analysis: {
              overallScore: 7.8,
              lighting: 8.0,
              clarity: 7.5,
              angles: 8.5,
              details: 7.5,
            },
            recommendations: ["Lepsze oświetlenie", "Ostrzejsze zdjęcia"],
            flaws: ["Rozmyte detale", "Za ciemne zdjęcie"],
          },
          {
            id: "sole-views",
            name: "Podeszwa",
            images: [
              "/placeholder.svg?height=400&width=400",
              "/placeholder.svg?height=400&width=400",
              "/placeholder.svg?height=400&width=400",
              "/placeholder.svg?height=400&width=400",
            ],
            analysis: {
              overallScore: 9.2,
              lighting: 9.5,
              clarity: 9.0,
              angles: 9.0,
              details: 9.2,
            },
            recommendations: ["Doskonałe zdjęcia podeszwy"],
            flaws: ["Brak znaczących wad"],
          },
        ],
        overallScore: 8.5,
        totalImages: 9,
      }
      setResult(mockResult)
      setIsAnalyzing(false)
    }, 3000)
  }

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return "text-green-400"
    if (score >= 7.0) return "text-yellow-400"
    return "text-red-400"
  }

  const getScoreBackground = (score: number) => {
    if (score >= 8.5) return "bg-green-400/20 border-green-400/30"
    if (score >= 7.0) return "bg-yellow-400/20 border-yellow-400/30"
    return "bg-red-400/20 border-red-400/30"
  }

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="glass-morphism rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-white mb-6">Wklej link do zdjęć QC</h2>

        <div className="space-y-4">
          <div className="relative">
            <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            <input
              type="url"
              value={qcLink}
              onChange={(e) => setQcLink(e.target.value)}
              placeholder="https://imgur.com/a/abc123 lub https://drive.google.com/..."
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="text-sm text-white/60">
            <p className="mb-2">Obsługiwane platformy:</p>
            <div className="flex flex-wrap gap-2">
              {["Imgur", "Google Drive", "Dropbox", "WeChat", "Yupoo", "Szwego"].map((platform) => (
                <span key={platform} className="px-2 py-1 bg-white/10 rounded text-xs">
                  {platform}
                </span>
              ))}
            </div>
          </div>

          <Button
            onClick={analyzeQC}
            disabled={!qcLink.trim() || isAnalyzing}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Analizuję QC...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Analizuj QC
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Overall Score */}
          <div className="glass-morphism rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Wynik Analizy QC</h2>
            <div className={`text-6xl font-bold mb-2 ${getScoreColor(result.overallScore)}`}>
              {result.overallScore}/10
            </div>
            <div className="flex items-center justify-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${
                    i < Math.floor(result.overallScore / 2) ? "text-yellow-400 fill-current" : "text-gray-600"
                  }`}
                />
              ))}
            </div>
            <p className="text-white/70 mb-4">
              Przeanalizowano {result.totalImages} zdjęć w {result.groups.length} grupach
            </p>
          </div>

          {/* Groups */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {result.groups.map((group) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`glass-morphism rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                  selectedGroup === group.id ? "ring-2 ring-blue-400" : "hover:bg-white/10"
                }`}
                onClick={() => setSelectedGroup(selectedGroup === group.id ? null : group.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">{group.name}</h3>
                  <div
                    className={`px-2 py-1 rounded text-sm font-medium ${getScoreBackground(group.analysis.overallScore)}`}
                  >
                    {group.analysis.overallScore}/10
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  {group.images.slice(0, 4).map((image, index) => (
                    <div key={index} className="aspect-square bg-white/5 rounded-lg overflow-hidden">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`${group.name} ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>

                <div className="text-sm text-white/60 mb-3">
                  {group.images.length} zdjęć • {group.flaws.length} wad
                </div>

                <Button size="sm" variant="ghost" className="w-full text-white/60 hover:text-white hover:bg-white/10">
                  <Eye className="w-4 h-4 mr-2" />
                  {selectedGroup === group.id ? "Zwiń szczegóły" : "Zobacz szczegóły"}
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Detailed View */}
          {selectedGroup && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="glass-morphism rounded-2xl p-8"
            >
              {(() => {
                const group = result.groups.find((g) => g.id === selectedGroup)!
                return (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-white">{group.name}</h3>
                      <Button
                        onClick={() => setSelectedGroup(null)}
                        variant="ghost"
                        className="text-white/60 hover:text-white"
                      >
                        Zamknij
                      </Button>
                    </div>

                    {/* Images Gallery */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="aspect-square bg-white/5 rounded-xl overflow-hidden">
                          <img
                            src={group.images[selectedImage] || "/placeholder.svg"}
                            alt={`${group.name} ${selectedImage + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {group.images.map((image, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedImage(index)}
                              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                selectedImage === index ? "border-blue-400" : "border-white/10 hover:border-white/30"
                              }`}
                            >
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`${group.name} ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-6">
                        {/* Scores */}
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-4">Oceny szczegółowe</h4>
                          <div className="space-y-3">
                            {Object.entries(group.analysis)
                              .filter(([key]) => key !== "overallScore")
                              .map(([key, score]) => (
                                <div key={key} className="space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-white/80 capitalize">
                                      {key === "lighting"
                                        ? "Oświetlenie"
                                        : key === "clarity"
                                          ? "Ostrość"
                                          : key === "angles"
                                            ? "Kąty"
                                            : "Detale"}
                                    </span>
                                    <span className={`font-bold ${getScoreColor(score)}`}>{score}/10</span>
                                  </div>
                                  <div className="w-full bg-white/10 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full ${
                                        score >= 8.5 ? "bg-green-400" : score >= 7.0 ? "bg-yellow-400" : "bg-red-400"
                                      }`}
                                      style={{ width: `${score * 10}%` }}
                                    />
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>

                        {/* Recommendations & Flaws */}
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <h4 className="text-white font-medium mb-2 flex items-center">
                              <Check className="w-4 h-4 text-green-400 mr-2" />
                              Rekomendacje
                            </h4>
                            <ul className="space-y-1">
                              {group.recommendations.map((rec, index) => (
                                <li key={index} className="text-white/70 text-sm flex items-start">
                                  <span className="text-blue-400 mr-2">•</span>
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="text-white font-medium mb-2 flex items-center">
                              <AlertTriangle className="w-4 h-4 text-yellow-400 mr-2" />
                              Zauważone wady
                            </h4>
                            <ul className="space-y-1">
                              {group.flaws.map((flaw, index) => (
                                <li key={index} className="text-white/70 text-sm flex items-start">
                                  <span className="text-yellow-400 mr-2">•</span>
                                  {flaw}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex justify-center space-x-4">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Pobierz Raport
            </Button>
            <Button
              onClick={() => {
                setResult(null)
                setQcLink("")
                setSelectedGroup(null)
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500"
            >
              Nowa Analiza
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
