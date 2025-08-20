// app/api/tracking/route.ts
import { NextResponse } from "next/server"
import axios from "axios"
import * as cheerio from "cheerio"
import validator from "validator"
import type { TrackingData, TrackingEvent } from "@/types/tracking"

const TRACKING_URLS = [
"http://106.55.5.75:8082/en/trackIndex.htm",
"http://114.132.51.252:8082/en/trackIndex.htm",
"http://47.112.107.11:8082/en/trackIndex.htm",
"http://39.101.71.24:8082/en/trackIndex.htm",
"http://120.78.2.65:8082/en/trackIndex.htm",
"http://www.hsd-ex.com:8082/trackIndex.htm",
"http://www.gdasgyl.com:8082/en/trackIndex.htm",
"http://120.24.176.176:8082/en/trackIndex.htm",
"http://111.230.211.49:8082/trackIndex.htm",
"http://111.230.15.119:8082/trackIndex.htm",
"http://120.77.221.225:8082/trackIndex.htm",
"http://49.234.188.236:8082/trackIndex.htm",
"http://115.29.184.71:8082/trackIndex.htm",
"http://114.132.51.252:8082/trackIndex.htm"
]

const LABEL_NORMALIZATION: { [key: string]: string } = {
  "tracking number": "trackingNumber",
  "numer śledzenia": "trackingNumber",
  "reference no.": "referenceNo",
  "numer referencyjny": "referenceNo",
  country: "country",
  kraj: "country",
  date: "date",
  data: "date",
  "the last record": "lastStatus",
  "ostatni status": "lastStatus",
  consigneename: "consigneeName",
  odbiorca: "consigneeName",
}

function normalizeLabel(label: string): string {
  const lowerCaseLabel = label.toLowerCase()
  return LABEL_NORMALIZATION[lowerCaseLabel] || label
}

// Funkcja do tłumaczenia statusu za pomocą DeepL
async function translateStatus(status: string): Promise<string> {
  const apiKey = process.env.DEEPL_API_KEY
  if (!apiKey || !status) {
    return status
  }

  try {
    const response = await axios.post(
      "https://api-free.deepl.com/v2/translate",
      new URLSearchParams({
        auth_key: apiKey,
        text: status,
        target_lang: "PL",
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    )
    return response.data.translations[0].text
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Błąd tłumaczenia DeepL:", error.response?.data || error.message)
    } else {
      console.error("Błąd tłumaczenia DeepL:", (error as Error).message)
    }
    return status
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { trackingNumber } = body

    if (!trackingNumber || !validator.isAlphanumeric(trackingNumber)) {
      return NextResponse.json({ error: "Invalid or missing trackingNumber" }, { status: 400 })
    }

    for (const url of TRACKING_URLS) {
      try {
        const response = await axios.post(url, new URLSearchParams({ documentCode: trackingNumber }), {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          timeout: 5000,
        })

        const $ = cheerio.load(response.data)
        const mainInfo: { [key: string]: string } = {}

        $("div.menu_ > ul")
          .first()
          .find("li")
          .each((i, el) => {
            const label = $(el).text().trim()
            const normalized = normalizeLabel(label)
            const value = $("div.menu_ > ul").eq(1).find("li").eq(i).text().trim()
            mainInfo[normalized] = value
          })

        if (mainInfo.trackingNumber && mainInfo.trackingNumber !== "") {
          const details: TrackingEvent[] = []
          $("table tr").each((_, row) => {
            const cells = $(row).find("td")
            if (cells.length === 3) {
              details.push({
                date: $(cells[0]).text().trim(),
                location: $(cells[1]).text().trim(),
                status: $(cells[2]).text().trim(),
                icon: "",
              })
            }
          })

          const translatedDetails = await Promise.all(
            details.map(async (event) => ({
              ...event,
              status: await translateStatus(event.status),
            })),
          )

          const result: TrackingData = {
            trackingNumber: mainInfo.trackingNumber,
            referenceNo: mainInfo.referenceNo || "N/A",
            country: mainInfo.country || "N/A",
            date: mainInfo.date || "N/A",
            lastStatus: await translateStatus(mainInfo.lastStatus || "N/A"),
            consigneeName: mainInfo.consigneeName || "N/A",
            details: translatedDetails,
            source: url,
          }

          return NextResponse.json(result, { status: 200 })
        }
      } catch (error) {
        console.warn(`Błąd podczas sprawdzania ${url}:`, (error as Error).message)
      }
    }

    return NextResponse.json({ error: "Nie znaleziono danych śledzenia na żadnym serwerze." }, { status: 404 })
  } catch (error) {
    console.error("Błąd w handlerze API:", error)
    return NextResponse.json({ error: "Wewnętrzny błąd serwera" }, { status: 500 })
  }
}