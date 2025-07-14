"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Link2, Search, Package, Truck, Clock, CheckCircle, AlertCircle, MapPin, Calendar, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { TrackingData } from "@/types/tracking"

interface TrackingResult {
  trackingNumber: string
  courier: string
  status: "pending" | "shipped" | "in-transit" | "delivered" | "exception"
  origin: string
  destination: string
  estimatedDelivery: string
  lastUpdate: string
  events: {
    date: string
    time: string
    location: string
    description: string
    status: string
    details?: string
  }[]
  packageInfo?: {
    weight: string
    dimensions: string
    service: string
  }
  apiData?: TrackingData
}

export function PackageTracking() {
  const [trackingLink, setTrackingLink] = useState("")
  const [isTracking, setIsTracking] = useState(false)
  const [result, setResult] = useState<TrackingResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const extractTrackingNumber = (input: string): string => {
    // Jeśli to link, wyciągnij numer
    if (input.includes("http")) {
      const match = input.match(/[A-Z0-9]{10,}/i)
      return match ? match[0] : input
    }
    // Jeśli to już numer, zwróć go
    return input.trim()
  }

  const mapStatusToLocal = (status: string): "pending" | "shipped" | "in-transit" | "delivered" | "exception" => {
    const lowerStatus = status.toLowerCase()
    if (lowerStatus.includes("dostarcz") || lowerStatus.includes("deliver")) return "delivered"
    if (lowerStatus.includes("transport") || lowerStatus.includes("transit") || lowerStatus.includes("w drodze"))
      return "in-transit"
    if (lowerStatus.includes("wysła") || lowerStatus.includes("ship")) return "shipped"
    if (lowerStatus.includes("problem") || lowerStatus.includes("błąd") || lowerStatus.includes("error"))
      return "exception"
    return "pending"
  }

  const trackPackage = async () => {
    if (!trackingLink.trim()) return

    setIsTracking(true)
    setError(null)

    try {
      const trackingNumber = extractTrackingNumber(trackingLink)

      const response = await fetch("/api/tracking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trackingNumber }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Błąd podczas śledzenia przesyłki")
      }

      // Konwertuj dane z API na format komponentu
      const trackingResult: TrackingResult = {
        trackingNumber: data.trackingNumber,
        courier: detectCourier(data.source),
        status: mapStatusToLocal(data.lastStatus),
        origin: data.country || "Nieznane",
        destination: "Polska",
        estimatedDelivery: calculateEstimatedDelivery(data.details),
        lastUpdate: data.date || new Date().toLocaleString("pl-PL"),
        events: data.details.map((event: any, index: number) => ({
          date: event.date.split(" ")[0] || new Date().toISOString().split("T")[0],
          time:
            event.date.split(" ")[1] || new Date().toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" }),
          location: event.location,
          description: event.status,
          status: mapStatusToLocal(event.status),
          details: index === 0 ? "Najnowsza aktualizacja" : undefined,
        })),
        packageInfo: {
          weight: "N/A",
          dimensions: "N/A",
          service: "Standard",
        },
        apiData: data,
      }

      setResult(trackingResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd")
    } finally {
      setIsTracking(false)
    }
  }

  const detectCourier = (source: string): string => {
    if (source.includes("hsd-ex")) return "HSD Express"
    if (source.includes("gdasgyl")) return "GD Express"
    return "China Post"
  }

  const calculateEstimatedDelivery = (events: any[]): string => {
    // Prosta logika - dodaj 3-7 dni od ostatniego wydarzenia
    const lastEvent = events[0]
    if (lastEvent && lastEvent.date) {
      const lastDate = new Date(lastEvent.date)
      lastDate.setDate(lastDate.getDate() + 5) // Dodaj 5 dni
      return lastDate.toISOString().split("T")[0]
    }
    return new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-400" />
      case "shipped":
        return <Package className="w-5 h-5 text-blue-400" />
      case "in-transit":
        return <Truck className="w-5 h-5 text-blue-500" />
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case "exception":
        return <AlertCircle className="w-5 h-5 text-red-400" />
      default:
        return <Package className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Oczekuje"
      case "shipped":
        return "Wysłane"
      case "in-transit":
        return "W transporcie"
      case "delivered":
        return "Dostarczone"
      case "exception":
        return "Problem"
      default:
        return "Nieznany"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-400 bg-yellow-400/20 border-yellow-400/30"
      case "shipped":
        return "text-blue-400 bg-blue-400/20 border-blue-400/30"
      case "in-transit":
        return "text-blue-500 bg-blue-500/20 border-blue-500/30"
      case "delivered":
        return "text-green-400 bg-green-400/20 border-green-400/30"
      case "exception":
        return "text-red-400 bg-red-400/20 border-red-400/30"
      default:
        return "text-gray-400 bg-gray-400/20 border-gray-400/30"
    }
  }

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="glass-morphism rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-white mb-6">Wklej link trackingowy lub numer przesyłki</h2>

        <div className="space-y-4">
          <div className="relative">
            <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            <input
              type="text"
              value={trackingLink}
              onChange={(e) => setTrackingLink(e.target.value)}
              placeholder="https://17track.net/track#nums=1234567890 lub 1234567890123"
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="text-sm text-white/60">
            <p className="mb-2">Obsługiwane kurierzy i platformy:</p>
            <div className="flex flex-wrap gap-2">
              {["China Post", "HSD Express", "GD Express", "EMS", "17Track", "AfterShip"].map((service) => (
                <span key={service} className="px-2 py-1 bg-white/10 rounded text-xs">
                  {service}
                </span>
              ))}
            </div>
          </div>

          <Button
            onClick={trackPackage}
            disabled={!trackingLink.trim() || isTracking}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500"
          >
            {isTracking ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Śledzę przesyłkę...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Śledź Przesyłkę
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
              <h3 className="text-lg font-semibold text-red-400">Błąd śledzenia</h3>
              <p className="text-white/70">{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Package Overview */}
          <div className="glass-morphism rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{result.trackingNumber}</h3>
                <p className="text-white/60">
                  {result.courier} • Ostatnia aktualizacja: {result.lastUpdate}
                </p>
              </div>
              <div className={`px-4 py-2 rounded-full border ${getStatusColor(result.status)}`}>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(result.status)}
                  <span className="font-medium">{getStatusText(result.status)}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-white/60 text-sm">Pochodzenie</p>
                  <p className="text-white font-medium">{result.origin}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-white/60 text-sm">Cel</p>
                  <p className="text-white font-medium">{result.destination}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-white/60 text-sm">Szacowana dostawa</p>
                  <p className="text-white font-medium">{result.estimatedDelivery}</p>
                </div>
              </div>
            </div>

            {/* API Source Info */}
            {result.apiData && (
              <div className="bg-white/5 rounded-xl p-4 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-medium text-sm">Dane z API</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-white/60">Numer ref.: </span>
                    <span className="text-white">{result.apiData.referenceNo}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Odbiorca: </span>
                    <span className="text-white">{result.apiData.consigneeName}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Źródło: </span>
                    <span className="text-white text-xs">{result.apiData.source.split("/")[2]}</span>
                  </div>
                </div>
              </div>
            )}

            {result.packageInfo && (
              <div className="bg-white/5 rounded-xl p-4">
                <h4 className="text-white font-medium mb-3">Informacje o paczce</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-white/60">Waga: </span>
                    <span className="text-white">{result.packageInfo.weight}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Wymiary: </span>
                    <span className="text-white">{result.packageInfo.dimensions}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Usługa: </span>
                    <span className="text-white">{result.packageInfo.service}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tracking Timeline */}
          <div className="glass-morphism rounded-2xl p-8">
            <h3 className="text-xl font-semibold text-white mb-6">Historia przesyłki</h3>
            <div className="space-y-6">
              {result.events.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-shrink-0 mt-1">{getStatusIcon(event.status)}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <span className="text-white font-medium">{event.date}</span>
                      <span className="text-white/60">{event.time}</span>
                      <span className="text-blue-400 text-sm">{event.location}</span>
                    </div>
                    <p className="text-white mb-1">{event.description}</p>
                    {event.details && <p className="text-white/60 text-sm">{event.details}</p>}
                  </div>
                  {index === 0 && (
                    <div className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded border border-blue-500/30">
                      Najnowsze
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => {
                setResult(null)
                setTrackingLink("")
                setError(null)
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500"
            >
              Nowe Śledzenie
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
              Odśwież Status
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
