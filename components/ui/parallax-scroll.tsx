"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import Link from "next/link" // Dodajemy import Link
import { cn } from "@/lib/utils"

interface ParallaxScrollProps {
  // Zmieniamy typ, aby akceptować obiekty ze ścieżką, id i typem
  images: { src: string; id: string; type: 'product' | 'batch' }[];
  className?: string
}

export function ParallaxScroll({ images, className }: ParallaxScrollProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ["start end", "end start"],
  })

  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200])
  const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 200])
  const translateThird = useTransform(scrollYProgress, [0, 1], [0, -200])

  const third = Math.ceil(images.length / 3)
  const firstPart = images.slice(0, third)
  const secondPart = images.slice(third, 2 * third)
  const thirdPart = images.slice(2 * third)

  const renderImage = (item: { src: string; id: string; type: 'product' | 'batch' }) => (
    <Link href={item.type === 'batch' ? `/bb/${item.id}` : `/w2c/${item.id}`} className="block w-full h-full">
      <Image
        src={item.src || "/placeholder.svg"}
        className="h-full w-full object-cover rounded-lg aspect-square"
        height="400"
        width="400"
        alt="thumbnail"
      />
    </Link>
  );

  return (
    <div className={cn("h-[40rem] items-start overflow-y-auto", className)} ref={gridRef}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start max-w-7xl mx-auto gap-10">
        <div className="grid gap-10">
          {firstPart.map((item, idx) => (
            <motion.div style={{ y: translateFirst }} key={"grid-1" + idx}>
              {renderImage(item)}
            </motion.div>
          ))}
        </div>
        <div className="grid gap-10">
          {secondPart.map((item, idx) => (
            <motion.div style={{ y: translateSecond }} key={"grid-2" + idx}>
              {renderImage(item)}
            </motion.div>
          ))}
        </div>
        <div className="grid gap-10">
          {thirdPart.map((item, idx) => (
            <motion.div style={{ y: translateThird }} key={"grid-3" + idx}>
              {renderImage(item)}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}