import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    clientName: { type: String, trim: true },
    platform: { type: String, trim: true },
    rating: Number,
    comment: String,
    reviewedAt: Date,
    sourceUrl: String,
  },
  { _id: false }
);

const offerSchema = new mongoose.Schema(
  {
    storeName: { type: String, required: true, trim: true },
    sellerName: String,
    price: Number,
    currency: { type: String, default: "PKR" },
    availability: String,
    productUrl: String,
    lastCheckedAt: Date,
  },
  { _id: false }
);

const videoSchema = new mongoose.Schema(
  {
    title: String,
    platform: { type: String, default: "YouTube" },
    url: String,
    channelTitle: String,
    publishedAt: Date,
  },
  { _id: false }
);

const phoneSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    brand: String,
    modelVariant: String,
    storageVariant: String,
    releaseYear: Number,
    country: { type: String, default: "Pakistan" },
    images: [String],
    minPrice: Number,
    maxPrice: Number,
    availabilitySummary: String,
    stores: [offerSchema],
    customerReviews: [reviewSchema],
    videoReviews: [videoSchema],
    sourceProductUrls: [String],
    sourcePlatforms: [String],
    offerCount: Number,
    salesCount: Number,
    seedSource: String,
    syncBatchId: String,
    sheetUpdatedAt: Date,
    lastSyncedAt: Date,
    scrapeStatus: { type: String, enum: ["fresh", "partial", "failed"], default: "fresh" },
    scrapeErrors: [String],
  },
  { collection: "phones", timestamps: true }
);

const Phone = mongoose.models.Phone || mongoose.model("Phone", phoneSchema);

export default Phone;
