import { discoverMarketplaceProductUrls, syncMarketplaceUrls } from "./marketplaceScraper.js";

const parseUrls = (value) =>
  (value || "")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);

let refreshInProgress = false;

export const refreshMarketplaceCatalog = async () => {
  if (refreshInProgress) return { skipped: true, reason: "A catalog refresh is already running." };

  refreshInProgress = true;
  try {
    const sourceUrls = parseUrls(process.env.SCRAPER_SOURCE_URLS);
    const catalogUrls = parseUrls(process.env.SCRAPER_DISCOVERY_URLS);
    const discoveredUrls = catalogUrls.length ? await discoverMarketplaceProductUrls(catalogUrls, 40) : [];
    const result = await syncMarketplaceUrls([...new Set([...sourceUrls, ...discoveredUrls])]);
    return { discoveredCount: discoveredUrls.length, ...result };
  } finally {
    refreshInProgress = false;
  }
};

export const startCatalogRefreshSchedule = () => {
  if (process.env.SCRAPER_AUTO_SYNC !== "true") return;

  const intervalMinutes = Number(process.env.SCRAPER_REFRESH_MINUTES || 15);
  const intervalMs = Math.max(intervalMinutes, 5) * 60 * 1000;

  const run = async () => {
    try {
      const result = await refreshMarketplaceCatalog();
      console.log(`Catalog refresh complete: ${result.synced?.length || 0} synced, ${result.failed?.length || 0} failed.`);
    } catch (error) {
      console.error("Catalog refresh failed:", error.message);
    }
  };

  setTimeout(run, 5000);
  setInterval(run, intervalMs);
  console.log(`Catalog refresh scheduled every ${intervalMs / 60000} minutes.`);
};
