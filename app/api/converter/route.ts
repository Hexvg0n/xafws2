// app/api/converter/route.ts
import { NextResponse } from 'next/server';

// ====================================================================
// KROK 1: Definicje typów dla TypeScript
// ====================================================================

type PlatformName = 'taobao' | 'tmall' | '1688' | 'weidian';

interface Platform {
  regex: RegExp;
  urlPattern: string;
  itemIDPattern: RegExp[];
}

interface Middleman {
  name: string;
  template: string;
  platformMapping?: { [key: string]: string };
  itemIDPattern: RegExp[];
  requiresDecoding: boolean;
  aliases?: string[];
  sourceCodeToPlatform?: { [key: string]: PlatformName };
}

// ====================================================================
// KROK 2: Otypowanie stałych
// ====================================================================

const platforms: Record<PlatformName, Platform> = {
  taobao: {
    regex: /(?:https?:\/\/)?(?:\w+\.)?taobao\.com/,
    urlPattern: "https://item.taobao.com/item.htm?id={{itemID}}",
    itemIDPattern: [/id=(\d+)/]
  },
  tmall: {
    regex: /(?:https?:\/\/)?(?:www\.)?detail\.tmall\.com/,
    urlPattern: "https://detail.tmall.com/item.htm?id={{itemID}}",
    itemIDPattern: [/id=(\d+)/]
  },
  "1688": {
    regex: /(?:https?:\/\/)?(?:\w+\.)?1688\.com/,
    urlPattern: "https://detail.1688.com/offer/{{itemID}}.html",
    itemIDPattern: [/\/offer\/(\d+)\.html/]
  },
  weidian: {
    regex: /(?:https?:\/\/)?(?:www\.)?weidian\.com/,
    urlPattern: "https://weidian.com/item.html?itemID={{itemID}}",
    itemIDPattern: [/itemID=(\d+)/, /itemI[dD]=(\d+)/]
  },
};

const middlemen: Record<string, Middleman> = {
     acbuy: {
    name: "ACBuy",
    template: "https://acbuy.com/product?id={{itemID}}&u=dripez&source={{platformIdentifier}}",
    platformMapping: {
      taobao: "TB",
      weidian: "WD",
      "1688": "AL"
    },
    itemIDPattern: [
      /id=(\d+)/,
      /\/offer\/(\d+)\.html/,
      /itemID=(\d+)/,
      /itemI[dD]=(\d+)/
    ],
    requiresDecoding: false,
    sourceCodeToPlatform: {
      "TB": "taobao",
      "WD": "weidian",
      "AL": "1688"
    }
  },
  kakobuy: {
    name: "Kakobuy",
    template: "https://www.kakobuy.com/item/details?url={{encodedUrl}}&affcode=dripez",
    platformMapping: {
      taobao: "item.taobao.com",
      "1688": "detail.1688.com",
      weidian: "weidian.com",
      tmall: "detail.tmall.com"
    },
    itemIDPattern: [/id=(\d+)/, /\/offer\/(\d+)\.html/, /itemID=(\d+)/, /itemI[dD]=(\d+)/],
    requiresDecoding: true
  },
  superbuy: {
    name: "Superbuy",
    template: "https://www.superbuy.com/en/page/buy/?url={{encodedUrl}}&partnercode=EiE9aB",
    platformMapping: {
      taobao: "item.taobao.com",
      "1688": "detail.1688.com",
      weidian: "weidian.com",
      tmall: "detail.tmall.com"
    },
    itemIDPattern: [/id=(\d+)/, /\/offer\/(\d+)\.html/, /itemID=(\d+)/, /itemI[dD]=(\d+)/],
    requiresDecoding: true
  },
  cssbuy: {
    name: "CSSBuy",
    template: "https://cssbuy.com/item{{cssPlatform}}{{itemID}}.html?promotionCode=90622f541f98cd81",
    platformMapping: {
      taobao: "-taobao-",
      "1688": "-1688-",
      weidian: "-micro-",
      tmall: "-tmall-"
    },
    itemIDPattern: [
      /id=(\d+)/,
      /\/offer\/(\d+)\.html/,
      /itemID=(\d+)/,
      /itemI[dD]=(\d+)/,
      /item-(taobao|1688|micro|tmall)-(\d+)\.html$/
    ],
    requiresDecoding: false
  },
  allchinabuy: {
    name: "AllChinaBuy",
    template: "https://www.allchinabuy.com/en/page/buy/?url={{encodedUrl}}&partnercode=wVK3gY",
    platformMapping: {
      taobao: "item.taobao.com",
      "1688": "detail.1688.com",
      weidian: "weidian.com",
      tmall: "detail.tmall.com"
    },
    itemIDPattern: [/id=(\d+)/, /\/offer\/(\d+)\.html/, /itemID=(\d+)/, /itemI[dD]=(\d+)/],
    requiresDecoding: true
  },
  basetao: {
    name: "Basetao",
    template: "https://www.basetao.com/products/agent/{{platformDomain}}/{{itemID}}.html",
    platformMapping: {
      taobao: "taobao",
      tmall: "tmall",
      "1688": "1688",
      weidian: "weidian"
    },
    itemIDPattern: [/agent\/(taobao|tmall|1688|weidian)\/(\d+)\.html/, /id=(\d+)/, /\/offer\/(\d+)\.html/, /itemID=(\d+)/, /itemI[dD]=(\d+)/],
    requiresDecoding: false
  },
  lovegobuy: {
    name: "LoveGoBuy",
    template: "https://www.lovegobuy.com/product?id={{itemID}}&shop_type={{platformDomain}}",
    platformMapping: {
      taobao: "taobao",
      "1688": "1688",
      weidian: "weidian",
      tmall: "tmall"
    },
    itemIDPattern: [/id=(\d+)/, /\/offer\/(\d+)\.html/, /itemID=(\d+)/, /itemI[dD]=(\d+)/],
    requiresDecoding: false
  },
  cnfans: {
    name: "CNFans",
    template: "https://cnfans.com/product/?shop_type={{platformDomain}}&id={{itemID}}&ref=191373",
    platformMapping: {
      taobao: "taobao",
      "1688": "ali_1688",
      weidian: "weidian",
      tmall: "tmall"
    },
    itemIDPattern: [/id=(\d+)/, /\/offer\/(\d+)\.html/, /itemID=(\d+)/, /itemI[dD]=(\d+)/],
    requiresDecoding: false,
    sourceCodeToPlatform: {
        "taobao": "taobao",
        "ali_1688": "1688",
        "weidian": "weidian",
        "tmall": "tmall"
    }
  },
  joyabuy: {
    name: "Joyabuy",
    template: "https://joyabuy.com/product/?shop_type={{platformDomain}}&id={{itemID}}&ref=300312245",
    platformMapping: {
      taobao: "taobao",
      "1688": "ali_1688",
      weidian: "weidian",
      tmall: "tmall"
    },
    itemIDPattern: [/id=(\d+)/, /\/offer\/(\d+)\.html/, /itemID=(\d+)/, /itemI[dD]=(\d+)/],
    requiresDecoding: false
  },
  mulebuy: {
    name: "Mulebuy",
    template: "https://mulebuy.com/product/?shop_type={{platformDomain}}&id={{itemID}}&ref=200345641",
    platformMapping: {
      taobao: "taobao",
      "1688": "ali_1688",
      weidian: "weidian",
      tmall: "tmall"
    },
    itemIDPattern: [/id=(\d+)/, /\/offer\/(\d+)\.html/, /itemID=(\d+)/, /itemI[dD]=(\d+)/],
    requiresDecoding: false
  },
  hoobuy: {
    name: "HooBuy",
    template: "https://hoobuy.com/product/{{platformCode}}/{{itemID}}?inviteCode=w8ow9ZB8",
    platformMapping: {
      '0': 'detail.1688.com',
      '1': 'item.taobao.com',
      '2': 'weidian.com',
      '3': 'detail.tmall.com'
    },
    itemIDPattern: [/product\/(\d+)\/(\d+)/, /id=(\d+)/, /\/offer\/(\d+)\.html/, /itemID=(\d+)/, /itemI[dD]=(\d+)/],
    requiresDecoding: false
  },
};

const platformNameToCode: Record<PlatformName, string> = {
  '1688': '0',
  'taobao': '1',
  'weidian': '2',
  'tmall': '3'
};

const codeToPlatformName: Record<string, PlatformName> = {
  '0': '1688',
  '1': 'taobao',
  '2': 'weidian',
  '3': 'tmall'
};

// ====================================================================
// KROK 3: Otypowanie funkcji pomocniczych
// ====================================================================

function extractItemID(url: string, patterns: RegExp[]): { itemID: string; platformCode?: string } | null {
  const decodedUrl = decodeURIComponent(url);
  for (const pattern of patterns) {
    const match = decodedUrl.match(pattern);
    if (match) {
      if (match.length > 2) {
        return { platformCode: match[1], itemID: match[2] };
      }
      return { itemID: match[1] };
    }
  }
  return null;
}

function decodeUrlIfNeeded(url: string, middleman: Middleman): string {
  if (middleman.requiresDecoding) {
    try {
      const urlObj = new URL(url);
      const urlParam = urlObj.searchParams.get('url');
      return urlParam ? decodeURIComponent(urlParam) : url;
    } catch (error) {
      return url; // Zwróć oryginalny URL, jeśli nie jest to prawidłowy URL
    }
  }
  return url;
}

function identifyPlatform(url: string): PlatformName | null {
  for (const name in platforms) {
    const platformName = name as PlatformName;
    if (platforms[platformName].regex.test(url)) return platformName;
  }
  return null;
}

function convertMiddlemanToOriginal(url: string): string | null {
    for (const [middlemanName, middleman] of Object.entries(middlemen)) {
        const aliases = [middlemanName, ...(middleman.aliases || [])];
        if (aliases.some(alias => url.toLowerCase().includes(alias.toLowerCase()))) {
            const processedUrl = decodeUrlIfNeeded(url, middleman);
            const extracted = extractItemID(processedUrl, middleman.itemIDPattern);

            if (extracted?.itemID) {
                let platformName: PlatformName | null = null;
                const itemID = extracted.itemID;

                if (middlemanName === 'acbuy' && middleman.sourceCodeToPlatform) {
                    const sourceMatch = processedUrl.match(/[?&]source=([^&]+)/);
                    if (sourceMatch && sourceMatch[1]) {
                        const sourceCode = sourceMatch[1];
                        platformName = middleman.sourceCodeToPlatform[sourceCode] || null;
                    }
                } else if (middlemanName === 'cnfans' && middleman.sourceCodeToPlatform) {
                    const shopTypeMatch = processedUrl.match(/[?&]shop_type=([^&]+)/);
                     if (shopTypeMatch && shopTypeMatch[1]) {
                        const shopType = shopTypeMatch[1];
                        platformName = middleman.sourceCodeToPlatform[shopType] || null;
                    }
                }
                else if (middleman.requiresDecoding) {
                    platformName = identifyPlatform(processedUrl);
                }

                if (platformName && itemID && platforms[platformName]) {
                    return platforms[platformName].urlPattern.replace("{{itemID}}", itemID);
                }
            }
        }
    }
    return null;
}

function convertUrlToMiddleman(originalUrlInput: string, middlemanKey: string): string | null {
    const middleman = middlemen[middlemanKey];
    if (!middleman) return null;

    const platformName = identifyPlatform(originalUrlInput);
    if (!platformName) return null;

    const extraction = extractItemID(originalUrlInput, platforms[platformName].itemIDPattern);
    if (!extraction?.itemID) return null;

    const itemID = extraction.itemID;
    const platformMappedValue = middleman.platformMapping?.[platformName];

    if (!platformMappedValue && (middleman.template.includes('{{platform') || middleman.template.includes('{{cssPlatform'))) {
        return null; // Ten agent nie obsługuje tej platformy
    }
    
    let resultUrl = middleman.template.replace(/{{itemID}}/g, itemID);

    if (resultUrl.includes('{{encodedUrl}}')) {
        resultUrl = resultUrl.replace(/{{encodedUrl}}/g, encodeURIComponent(originalUrlInput));
    }
    if (platformMappedValue) {
        resultUrl = resultUrl.replace(/{{platformDomain}}/g, platformMappedValue);
        resultUrl = resultUrl.replace(/{{cssPlatform}}/g, platformMappedValue);
        resultUrl = resultUrl.replace(/{{platformIdentifier}}/g, platformMappedValue);
    }
     if (middlemanKey === 'hoobuy') {
        const platformCode = platformNameToCode[platformName];
        if (platformCode) {
            resultUrl = resultUrl.replace('{{platformCode}}', platformCode);
        }
    }

    return resultUrl;
}

// ====================================================================
// KROK 4: Otypowanie endpointów API
// ====================================================================

export async function GET() {
  const headers = { 'Content-Type': 'application/json' };
  try {
    const agents = Object.entries(middlemen).map(([key, value]) => ({
      key: key,
      name: value.name
    }));
    return NextResponse.json({ agents }, { headers });
  } catch (error) {
    return NextResponse.json({ error: 'Wewnętrzny błąd serwera' }, { status: 500, headers });
  }
}

export async function POST(request: Request) {
  const headers = { 'Content-Type': 'application/json' };
  try {
    const body = await request.json();
    const url = body.url;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Brak wymaganego parametru URL' }, { status: 400, headers });
    }

    let originalProductUrl = convertMiddlemanToOriginal(url) || (identifyPlatform(url) ? url : null);

    if (originalProductUrl) {
         const platform = identifyPlatform(originalProductUrl);
         if (platform) {
            const idData = extractItemID(originalProductUrl, platforms[platform].itemIDPattern);
            if (idData?.itemID) {
                originalProductUrl = platforms[platform].urlPattern.replace("{{itemID}}", idData.itemID);
            }
         }
    }
    
    const convertedLinks: { key: string; name: string; url: string }[] = [];
    const baseLinkForMiddlemen = originalProductUrl || url;

    for (const [middlemanKey, middlemanValue] of Object.entries(middlemen)) {
      const convertedUrl = convertUrlToMiddleman(baseLinkForMiddlemen, middlemanKey);
      if (convertedUrl) {
        convertedLinks.push({
          key: middlemanKey,
          name: middlemanValue.name,
          url: convertedUrl
        });
      }
    }

    const responsePayload = {
      originalUrl: originalProductUrl || "Nie udało się zidentyfikować oryginalnego linku.",
      convertedLinks: convertedLinks
    };

    return NextResponse.json(responsePayload, { headers });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Wystąpił nieznany błąd.';
    return NextResponse.json({ error: 'Wewnętrzny błąd serwera', details: errorMessage }, { status: 500, headers });
  }
}

export async function OPTIONS() {
  return NextResponse.json(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}