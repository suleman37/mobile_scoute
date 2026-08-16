import express from "express";
import {
  getPhone
} from "../controllers/phoneController.js";
import { syncCatalog } from "../controllers/scraperController.js";

const mobileRoute = express.Router();

mobileRoute.get("/pakistan-iphones", getPhone);
mobileRoute.post("/scrape/sync", syncCatalog);

export default mobileRoute;
