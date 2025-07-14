"use client"

import { Calculator, LinkIcon, Truck, Upload } from "lucide-react"
import { HoverEffect } from "@/components/ui/card-hover-effect"

const tools = [
  {
    title: "QC Checker",
    description: "Prześlij zdjęcia QC i uzyskaj natychmiastową analizę jakości.",
    link: "/tools/qc-checker",
    icon: <Upload className="w-8 h-8 text-blue-400" />,
    titleClassName: "text-blue-400",
  },
  {
    title: "Konwerter Linków",
    description: "Konwertuj linki z popularnych platform na uniwersalne formaty.",
    link: "/tools/link-converter",
    icon: <LinkIcon className="w-8 h-8 text-green-400" />,
    titleClassName: "text-green-400",
  },
  {
    title: "Śledzenie Paczek",
    description: "Śledź swoje przesyłki w czasie rzeczywistym od różnych kurierów.",
    link: "/tools/package-tracking",
    icon: <Truck className="w-8 h-8 text-yellow-400" />,
    titleClassName: "text-yellow-400",
  },
  {
    title: "Kalkulatory",
    description: "Oblicz koszty wysyłki, cła i inne opłaty związane z zamówieniem.",
    link: "/tools/calculators",
    icon: <Calculator className="w-8 h-8 text-red-400" />,
    titleClassName: "text-red-400",
  },
]

export function ToolsContent() {
  return (
    <div className="max-w-5xl mx-auto px-8">
      <HoverEffect items={tools} />
    </div>
  )
}
