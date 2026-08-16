import Phone from "../models/phoneModel.js";

const sourceDefinitions = [
  { name: "Daraz", hosts: ["daraz.pk", "www.daraz.pk"] },
  { name: "PriceOye", hosts: ["priceoye.pk", "www.priceoye.pk"] },
  { name: "Telemart", hosts: ["telemart.pk", "www.telemart.pk"] },
  { name: "Paklap", hosts: ["paklap.pk", "www.paklap.pk"] },
  { name: "Shophive", hosts: ["shophive.com", "www.shophive.com"] },
  { name: "Mega.pk", hosts: ["mega.pk", "www.mega.pk"] },
];

// Curated direct review links already used by the catalog seed. This keeps the
// no-API-key flow on direct video pages instead of storing generic search URLs.
const savedYouTubeReviews = {
  "iphone 16 pro max": "https://www.youtube.com/watch?v=xQwfnYh2dmY",
  "iphone 16 pro": "https://www.youtube.com/watch?v=7fQGx7mZxcw",
  "iphone 16 plus": "https://www.youtube.com/watch?v=yvJE-ktP7OE",
  "iphone 16": "https://www.youtube.com/watch?v=aDqzDoJPkaA",
  "iphone 15 pro max": "https://www.youtube.com/watch?v=cVpcl7KGly0",
  "iphone 15 pro": "https://www.youtube.com/watch?v=2LogFbMb58w",
  "iphone 15 plus": "https://www.youtube.com/watch?v=C8i_Y8Ky8CE",
  "iphone 15": "https://www.youtube.com/watch?v=T8ZnoMQpimA",
  "galaxy s25 ultra": "https://www.youtube.com/watch?v=XkXbkxtBlwY",
  "galaxy s25 plus": "https://www.youtube.com/watch?v=TbZH_hpveUk",
  "galaxy s25": "https://www.youtube.com/watch?v=1HFLee3XkcE",
  "galaxy s24 ultra": "https://www.youtube.com/watch?v=K-JGaqfIOmI",
  "galaxy a56": "https://www.youtube.com/watch?v=Lnjk-ptx-SY",
  "galaxy a36": "https://www.youtube.com/watch?v=Nli7B1PTRxA",
  "pixel 9 pro xl": "https://www.youtube.com/watch?v=fybgemCCPYI",
  "pixel 9 pro": "https://www.youtube.com/watch?v=bfuCOm7lKSo",
  "pixel 9": "https://www.youtube.com/watch?v=fkzPG0k6rSk",
  "xiaomi 15 ultra": "https://www.youtube.com/watch?v=IksM2YockJk",
  "xiaomi 15": "https://www.youtube.com/watch?v=CHNu0Wa1Pzs",
  "redmi note 14 pro": "https://www.youtube.com/watch?v=5s9FTlAfmGU",
  "oneplus 13": "https://www.youtube.com/watch?v=dJqK2lvrZNk",
  "oneplus 13r": "https://www.youtube.com/watch?v=pCIr0cFtvw8",
  "nothing phone 3a pro": "https://www.youtube.com/watch?v=oVV1Sw0V30U",
  "nothing phone 3a": "https://www.youtube.com/watch?v=wr002omh-5Q",
  "oppo reno13 pro": "https://www.youtube.com/watch?v=1zrXqO1SEbw",
  "oppo reno13": "https://www.youtube.com/watch?v=0nHe7vCE7og",
  "vivo v50": "https://www.youtube.com/watch?v=iQi1CItGwAQ",
  "vivo x200 pro": "https://www.youtube.com/watch?v=UBdhdzu8iqE",
  "realme 14 pro": "https://www.youtube.com/watch?v=vJL6DBcEISw",
  "realme gt 7 pro": "https://www.youtube.com/watch?v=JjsOXOBvUos",
  "infinix note 40 pro": "https://www.youtube.com/watch?v=W9PghlPmWK8",
  "tecno camon 30 premier": "https://www.youtube.com/watch?v=SfUv5So6fIM",
};

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const toSlug = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const normalizeVideoTitle = (value) =>
  value
    .toLowerCase()
    .replace(/\+/g, " plus ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const parsePrice = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;
  const numeric = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(numeric) ? numeric : null;
};

const asArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

const findProductNode = (value) => {
  if (!value || typeof value !== "object") return null;
  if (Array.isArray(value)) {
    return value.map(findProductNode).find(Boolean) || null;
  }
  if (value["@type"] === "Product" || asArray(value["@type"]).includes("Product")) {
    return value;
  }
  return Object.values(value).map(findProductNode).find(Boolean) || null;
};

const extractJsonLd = (html) => {
  const matches = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  return matches.flatMap((match) => {
    try {
      return [JSON.parse(match[1].trim())];
    } catch {
      return [];
    }
  });
};

const readMeta = (html, attribute, value) => {
  const expression = new RegExp(`<meta[^>]+${attribute}=["']${value}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i");
  return html.match(expression)?.[1] || null;
};

const decodeHtmlText = (value = "") =>
  value
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number.parseInt(code, 10)))
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");

const extractShophiveProduct = (html, productUrl) => {
  const title = decodeHtmlText(readMeta(html, "property", "og:title") || html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, "").trim());
  const price = parsePrice(html.match(/data-price-amount=["']([^"']+)["'][^>]+data-price-type=["']finalPrice/i)?.[1]);
  const image = readMeta(html, "property", "og:image");
  const brand = html.match(/class=["']brand-link["'][^>]+title=["']([^"']+)["']/i)?.[1] || "Unknown";
  const inStock = /class=["'][^"']*stock available[^"']*["']/i.test(html);

  if (!title || price === null) return null;
  return {
    title,
    brand,
    images: image ? [image] : [],
    offer: {
      storeName: "Shophive",
      sellerName: "Shophive",
      price,
      currency: readMeta(html, "property", "product:price:currency") || "PKR",
      availability: inStock ? "In stock" : "Check source",
      productUrl,
      lastCheckedAt: new Date(),
    },
    reviews: [],
  };
};

const extractTelemartProduct = (html, productUrl) => {
  const title = decodeHtmlText(readMeta(html, "property", "og:title"));
  const price = parsePrice(readMeta(html, "property", "og:price:amount"));
  const image = readMeta(html, "property", "og:image");

  if (!title || price === null) return null;
  return {
    title,
    brand: title.split(/\s+/)[0] || "Unknown",
    images: image ? [image] : [],
    offer: {
      storeName: "Telemart",
      sellerName: "Telemart",
      price,
      currency: readMeta(html, "property", "og:price:currency") || "PKR",
      availability: /sold out/i.test(html) ? "Out of stock" : "Check source",
      productUrl,
      lastCheckedAt: new Date(),
    },
    reviews: [],
  };
};

const getSourceDefinition = (productUrl) => {
  const host = new URL(productUrl).hostname.toLowerCase();
  return sourceDefinitions.find((source) => source.hosts.includes(host)) || null;
};

const assertSupportedUrl = (productUrl) => {
  const url = new URL(productUrl);
  if (url.protocol !== "https:") {
    throw new Error("Only HTTPS marketplace product URLs are supported.");
  }
  const source = getSourceDefinition(productUrl);
  if (!source) {
    throw new Error("This marketplace is not in the allowed source list.");
  }
  return source;
};

const fetchProductPage = async (productUrl) => {
  const response = await fetch(productUrl, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent": "MobileScoutCatalogSync/1.0 (+contact@mobilescout.local)",
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`Source returned HTTP ${response.status}.`);
  }
  return response.text();
};

const extractCatalogProductUrls = (html, catalogUrl) => {
  const catalog = new URL(catalogUrl);
  const catalogOrigin = catalog.origin;
  const hrefs = [...html.matchAll(/href=["']([^"']+)["']/gi)].map((match) => match[1]);
  const absoluteHrefs = hrefs
    .map((href) => {
      try {
        return new URL(href, catalogOrigin).toString();
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  if (["priceoye.pk", "www.priceoye.pk"].includes(catalog.hostname)) {
    return absoluteHrefs.filter((url) => {
      const parsed = new URL(url);
      return (
        parsed.hostname === "priceoye.pk" &&
        /^\/mobiles\/[^/]+\/[^/?#]+$/.test(parsed.pathname) &&
        !parsed.pathname.includes("/pricelist/") &&
        !parsed.pathname.includes("/compare/")
      );
    });
  }

  if (["telemart.pk", "www.telemart.pk"].includes(catalog.hostname)) {
    return [...html.matchAll(/\\"url\\":\\"(\\\/products\\\/[^\\"]+)/g)]
      .map((match) => `https://telemart.pk${match[1].replaceAll('\\/', '/')}`);
  }

  if (["shophive.com", "www.shophive.com"].includes(catalog.hostname)) {
    return absoluteHrefs.filter((url) => {
      const parsed = new URL(url);
      return parsed.hostname.endsWith("shophive.com") && /^\/[^/]+\/$/.test(parsed.pathname) && !["mobile-phones", "catalogsearch", "prices", "cart", "checkout", "customer"].includes(parsed.pathname.split("/")[1]);
    });
  }

  if (["mega.pk", "www.mega.pk"].includes(catalog.hostname)) {
    return absoluteHrefs.filter((url) => /\/mobiles_products\/\d+\//.test(new URL(url).pathname));
  }

  return [];
};

export const discoverMarketplaceProductUrls = async (catalogUrls, perPlatformLimit = 35) => {
  const urlsByHost = new Map();

  for (const catalogUrl of [...new Set(catalogUrls)].slice(0, 20)) {
    const parsed = new URL(catalogUrl);
    if (parsed.protocol !== "https:" || !sourceDefinitions.some((source) => source.hosts.includes(parsed.hostname))) {
      throw new Error("Discovery only supports approved public marketplace catalog URLs.");
    }

    try {
      const html = await fetchProductPage(catalogUrl);
      const sourceUrls = urlsByHost.get(parsed.hostname) || [];
      sourceUrls.push(...extractCatalogProductUrls(html, catalogUrl));
      urlsByHost.set(parsed.hostname, sourceUrls);
    } catch (error) {
      console.warn(`Catalog discovery skipped ${catalogUrl}: ${error.message}`);
    }
    await sleep(800);
  }

  return [...urlsByHost.values()].flatMap((urls) => [...new Set(urls)].slice(0, perPlatformLimit));
};

const getYouTubeReview = async (title) => {
  const normalizedTitle = normalizeVideoTitle(title);
  const curatedMatch = Object.entries(savedYouTubeReviews).find(([model]) =>
    normalizedTitle.includes(model) || model.includes(normalizedTitle)
  );

  if (curatedMatch) {
    return {
      title: `${title} full video review`,
      platform: "YouTube",
      url: curatedMatch[1],
    };
  }

  if (!process.env.YOUTUBE_API_KEY) return null;

  const query = new URLSearchParams({
    key: process.env.YOUTUBE_API_KEY,
    part: "snippet",
    type: "video",
    maxResults: "1",
    q: `${title} full review`,
  });
  const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${query}`);
  if (!response.ok) throw new Error("YouTube review lookup failed.");

  const payload = await response.json();
  const item = payload.items?.[0];
  if (!item?.id?.videoId) return null;

  return {
    title: item.snippet.title,
    platform: "YouTube",
    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
  };
};

export const scrapeProductUrl = async (productUrl) => {
  const source = assertSupportedUrl(productUrl);
  const html = await fetchProductPage(productUrl);
  const product = extractJsonLd(html).map(findProductNode).find(Boolean);

  if (!product && source.name === "Shophive") {
    const fallbackProduct = extractShophiveProduct(html, productUrl);
    if (fallbackProduct) return fallbackProduct;
  }

  if (!product && source.name === "Telemart") {
    const fallbackProduct = extractTelemartProduct(html, productUrl);
    if (fallbackProduct) return fallbackProduct;
  }

  if (!product?.name) {
    throw new Error("No public Product structured data was found on this page.");
  }

  const offer = asArray(product.offers)[0] || {};
  const price = parsePrice(offer.price || product.price);
  const reviews = asArray(product.review).slice(0, 10).map((review) => ({
    clientName: review.author?.name || review.author || "Anonymous customer",
    platform: source.name,
    rating: Number(review.reviewRating?.ratingValue) || null,
    comment: review.reviewBody || review.description || "",
    reviewedAt: review.datePublished || null,
    sourceUrl: productUrl,
  }));

  return {
    title: product.name.trim(),
    brand: product.brand?.name || product.brand || "Unknown",
    images: asArray(product.image).filter(Boolean),
    offer: {
      storeName: source.name,
      sellerName: offer.seller?.name || source.name,
      price,
      currency: offer.priceCurrency || "PKR",
      availability: offer.availability?.split("/").pop()?.replace(/([A-Z])/g, " $1").trim() || "Availability unknown",
      productUrl,
      lastCheckedAt: new Date(),
    },
    reviews,
  };
};

const mergeRecords = (records) => {
  const first = records[0];
  const offers = records.map((record) => record.offer).filter((offer) => offer.price !== null);
  const prices = offers.map((offer) => offer.price);
  const reviews = records.flatMap((record) => record.reviews);
  const sourceUrls = records.map((record) => record.offer.productUrl);

  return {
    title: first.title,
    slug: toSlug(first.title),
    brand: first.brand,
    country: "Pakistan",
    images: [...new Set(records.flatMap((record) => record.images))].slice(0, 8),
    minPrice: prices.length ? Math.min(...prices) : null,
    maxPrice: prices.length ? Math.max(...prices) : null,
    availabilitySummary: offers.some((offer) => /in stock|available/i.test(offer.availability)) ? "Available now" : "Check source",
    stores: offers,
    customerReviews: reviews,
    sourceProductUrls: sourceUrls,
    sourcePlatforms: [...new Set(offers.map((offer) => offer.storeName))],
    offerCount: offers.length,
    lastSyncedAt: new Date(),
    scrapeStatus: offers.length ? "fresh" : "partial",
    scrapeErrors: [],
  };
};

export const syncMarketplaceUrls = async (urls) => {
  if (!Array.isArray(urls) || urls.length === 0) {
    throw new Error("Provide at least one approved marketplace product URL.");
  }

  const results = [];
  for (const productUrl of [...new Set(urls)].slice(0, 150)) {
    try {
      results.push({ status: "fulfilled", value: await scrapeProductUrl(productUrl) });
    } catch (error) {
      results.push({ status: "rejected", reason: error.message, productUrl });
    }
    await sleep(1200);
  }

  const successful = results.filter((result) => result.status === "fulfilled").map((result) => result.value);
  const grouped = successful.reduce((groups, record) => {
    const key = toSlug(record.title);
    groups.set(key, [...(groups.get(key) || []), record]);
    return groups;
  }, new Map());
  const synced = [];

  for (const records of grouped.values()) {
    const document = mergeRecords(records);
    const videoReview = await getYouTubeReview(document.title);
    document.videoReviews = videoReview ? [videoReview] : [];
    await Phone.findOneAndUpdate({ slug: document.slug }, { $set: document }, { upsert: true, new: true, setDefaultsOnInsert: true });
    synced.push(document.slug);
  }

  return {
    synced,
    failed: results.filter((result) => result.status === "rejected").map(({ productUrl, reason }) => ({ productUrl, reason })),
  };
};
