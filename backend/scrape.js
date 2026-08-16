import "dotenv/config";
import mongoose from "mongoose";
import ConnectDB from "./config/mongo.js";
import { discoverMarketplaceProductUrls, syncMarketplaceUrls } from "./services/marketplaceScraper.js";

const urls = (process.env.SCRAPER_SOURCE_URLS || "")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

const catalogUrls = (process.env.SCRAPER_DISCOVERY_URLS || "")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

try {
  await ConnectDB();
  const discoveredUrls = catalogUrls.length ? await discoverMarketplaceProductUrls(catalogUrls, 40) : [];
  const productUrls = [...new Set([...urls, ...discoveredUrls])];
  console.log(`Starting rate-limited sync for ${productUrls.length} public product pages.`);
  const result = await syncMarketplaceUrls(productUrls);
  console.log(JSON.stringify({ discoveredCount: discoveredUrls.length, ...result }, null, 2));
  process.exitCode = result.failed.length ? 1 : 0;
} catch (error) {
  console.error("Marketplace sync failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
