import express from "express";
import {
  getPhone
} from "../controllers/phoneController.js";

const mobileRoute = express.Router();

mobileRoute.get("/pakistan-iphones", getPhone);

export default mobileRoute;
