import "dotenv/config";
import mongoose from "mongoose";
import ConnectDB from "./config/mongo.js";
import { startCatalogRefreshSchedule } from "./services/catalogRefresh.js";

try {
  await ConnectDB();
  startCatalogRefreshSchedule();
  console.log("Catalog refresh worker is running.");
} catch (error) {
  console.error("Could not start catalog refresh worker:", error.message);
  process.exit(1);
}

const shutdown = async () => {
  await mongoose.disconnect();
  process.exit(0);
};

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
