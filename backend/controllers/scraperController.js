import { syncMarketplaceUrls } from "../services/marketplaceScraper.js";

const isAuthorized = (req) =>
  process.env.SCRAPER_API_KEY && req.get("x-scraper-key") === process.env.SCRAPER_API_KEY;

const syncCatalog = async (req, res) => {
  if (!isAuthorized(req)) {
    return res.status(401).json({ success: false, message: "Valid x-scraper-key is required." });
  }

  try {
    const result = await syncMarketplaceUrls(req.body?.urls);
    return res.json({ success: true, ...result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export { syncCatalog };
