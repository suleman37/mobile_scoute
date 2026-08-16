import "dotenv/config";
import mongoose from "mongoose";
import ConnectDB from "./config/mongo.js";
import { refreshMarketplaceCatalog } from "./services/catalogRefresh.js";

try {
  await ConnectDB();
  const result = await refreshMarketplaceCatalog();
  console.log(JSON.stringify(result, null, 2));
  process.exitCode = result.failed.length ? 1 : 0;
} catch (error) {
  console.error("Marketplace sync failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
