import "dotenv/config";
import mongoose from "mongoose";
import ConnectDB from "./config/mongo.js";
import Phone from "./models/phoneModel.js";

const catalog = [
  ["iPhone 16 Pro Max", "Apple", "16 Pro Max", "256GB", 469999, 479999, 2024],
  ["iPhone 16 Pro", "Apple", "16 Pro", "128GB", 394999, 404999, 2024],
  ["iPhone 16 Plus", "Apple", "16 Plus", "128GB", 329999, 339999, 2024],
  ["iPhone 16", "Apple", "16", "128GB", 284999, 294999, 2024],
  ["iPhone 15 Pro Max", "Apple", "15 Pro Max", "256GB", 409999, 424999, 2023],
  ["iPhone 15 Pro", "Apple", "15 Pro", "128GB", 349999, 364999, 2023],
  ["iPhone 15 Plus", "Apple", "15 Plus", "128GB", 279999, 289999, 2023],
  ["iPhone 15", "Apple", "15", "128GB", 239999, 249999, 2023],
  ["Galaxy S25 Ultra", "Samsung", "S25 Ultra", "512GB", 434999, 449999, 2025],
  ["Galaxy S25 Plus", "Samsung", "S25 Plus", "256GB", 319999, 334999, 2025],
  ["Galaxy S25", "Samsung", "S25", "256GB", 249999, 264999, 2025],
  ["Galaxy S24 Ultra", "Samsung", "S24 Ultra", "256GB", 319999, 334999, 2024],
  ["Galaxy A56", "Samsung", "A56", "256GB", 139999, 149999, 2025],
  ["Galaxy A36", "Samsung", "A36", "128GB", 109999, 119999, 2025],
  ["Pixel 9 Pro XL", "Google", "9 Pro XL", "256GB", 329999, 344999, 2024],
  ["Pixel 9 Pro", "Google", "9 Pro", "128GB", 279999, 294999, 2024],
  ["Pixel 9", "Google", "9", "128GB", 219999, 234999, 2024],
  ["Xiaomi 15 Ultra", "Xiaomi", "15 Ultra", "512GB", 369999, 384999, 2025],
  ["Xiaomi 15", "Xiaomi", "15", "256GB", 249999, 264999, 2025],
  ["Redmi Note 14 Pro+", "Xiaomi", "Note 14 Pro+", "256GB", 119999, 129999, 2025],
  ["OnePlus 13", "OnePlus", "13", "256GB", 279999, 294999, 2025],
  ["OnePlus 13R", "OnePlus", "13R", "256GB", 184999, 199999, 2025],
  ["Nothing Phone (3a) Pro", "Nothing", "Phone (3a) Pro", "256GB", 164999, 174999, 2025],
  ["Nothing Phone (3a)", "Nothing", "Phone (3a)", "128GB", 134999, 144999, 2025],
  ["OPPO Reno13 Pro", "OPPO", "Reno13 Pro", "512GB", 224999, 239999, 2025],
  ["OPPO Reno13", "OPPO", "Reno13", "256GB", 169999, 179999, 2025],
  ["vivo V50", "vivo", "V50", "256GB", 139999, 149999, 2025],
  ["vivo X200 Pro", "vivo", "X200 Pro", "512GB", 299999, 314999, 2025],
  ["realme 14 Pro+", "realme", "14 Pro+", "256GB", 124999, 134999, 2025],
  ["realme GT 7 Pro", "realme", "GT 7 Pro", "512GB", 239999, 254999, 2025],
  ["Infinix Note 40 Pro+", "Infinix", "Note 40 Pro+", "256GB", 89999, 99999, 2024],
  ["TECNO Camon 30 Premier", "TECNO", "Camon 30 Premier", "512GB", 149999, 159999, 2024],
];

const youtubeReviewUrls = {
  "iPhone 16 Pro Max": "https://www.youtube.com/watch?v=xQwfnYh2dmY",
  "iPhone 16 Pro": "https://www.youtube.com/watch?v=7fQGx7mZxcw",
  "iPhone 16 Plus": "https://www.youtube.com/watch?v=yvJE-ktP7OE",
  "iPhone 16": "https://www.youtube.com/watch?v=aDqzDoJPkaA",
  "iPhone 15 Pro Max": "https://www.youtube.com/watch?v=cVpcl7KGly0",
  "iPhone 15 Pro": "https://www.youtube.com/watch?v=2LogFbMb58w",
  "iPhone 15 Plus": "https://www.youtube.com/watch?v=C8i_Y8Ky8CE",
  "iPhone 15": "https://www.youtube.com/watch?v=T8ZnoMQpimA",
  "Galaxy S25 Ultra": "https://www.youtube.com/watch?v=XkXbkxtBlwY",
  "Galaxy S25 Plus": "https://www.youtube.com/watch?v=TbZH_hpveUk",
  "Galaxy S25": "https://www.youtube.com/watch?v=1HFLee3XkcE",
  "Galaxy S24 Ultra": "https://www.youtube.com/watch?v=K-JGaqfIOmI",
  "Galaxy A56": "https://www.youtube.com/watch?v=Lnjk-ptx-SY",
  "Galaxy A36": "https://www.youtube.com/watch?v=Nli7B1PTRxA",
  "Pixel 9 Pro XL": "https://www.youtube.com/watch?v=fybgemCCPYI",
  "Pixel 9 Pro": "https://www.youtube.com/watch?v=bfuCOm7lKSo",
  "Pixel 9": "https://www.youtube.com/watch?v=fkzPG0k6rSk",
  "Xiaomi 15 Ultra": "https://www.youtube.com/watch?v=IksM2YockJk",
  "Xiaomi 15": "https://www.youtube.com/watch?v=CHNu0Wa1Pzs",
  "Redmi Note 14 Pro+": "https://www.youtube.com/watch?v=5s9FTlAfmGU",
  "OnePlus 13": "https://www.youtube.com/watch?v=dJqK2lvrZNk",
  "OnePlus 13R": "https://www.youtube.com/watch?v=pCIr0cFtvw8",
  "Nothing Phone (3a) Pro": "https://www.youtube.com/watch?v=oVV1Sw0V30U",
  "Nothing Phone (3a)": "https://www.youtube.com/watch?v=wr002omh-5Q",
  "OPPO Reno13 Pro": "https://www.youtube.com/watch?v=1zrXqO1SEbw",
  "OPPO Reno13": "https://www.youtube.com/watch?v=0nHe7vCE7og",
  "vivo V50": "https://www.youtube.com/watch?v=iQi1CItGwAQ",
  "vivo X200 Pro": "https://www.youtube.com/watch?v=UBdhdzu8iqE",
  "realme 14 Pro+": "https://www.youtube.com/watch?v=vJL6DBcEISw",
  "realme GT 7 Pro": "https://www.youtube.com/watch?v=JjsOXOBvUos",
  "Infinix Note 40 Pro+": "https://www.youtube.com/watch?v=W9PghlPmWK8",
  "TECNO Camon 30 Premier": "https://www.youtube.com/watch?v=SfUv5So6fIM",
};

const createYouTubeReview = (title) => ({
  title: `${title} full video review`,
  platform: "YouTube",
  url: youtubeReviewUrls[title],
});

const sampleSalesCounts = {
  "iPhone 16": 1240,
  "Galaxy S25": 1160,
  "Redmi Note 14 Pro+": 1095,
};

const customerProfiles = [
  "Ali R.", "Sana K.", "Usman A.", "Hira M.", "Hamza F.", "Ayesha N.",
  "Bilal S.", "Maham I.", "Zain H.", "Laiba A.", "Ahmed K.", "Noor F.",
  "Saad R.", "Iqra M.", "Danish A.", "Mehwish K.", "Farhan S.", "Aiman H.",
  "Taha R.", "Anaya F.", "Shayan A.", "Eman K.", "Rayan M.", "Minal S.",
  "Fahad H.", "Zoya R.", "Arham K.", "Areeba N.", "Huzaifa S.", "Maryam A.",
  "Hassan F.", "Alina K.",
];

const reviewPlatforms = ["PriceOye", "Daraz", "Google Reviews", "Facebook", "Instagram"];
const reviewMessages = [
  "I have been using the {phone} for a few weeks. The performance and display have been excellent for everyday use.",
  "The {phone} feels premium, has reliable battery life, and arrived exactly as expected.",
  "Very happy with the cameras and smooth day-to-day experience on the {phone}.",
  "The {phone} has been a great fit for work, social apps, and media. The setup process was simple.",
];

const createCustomerReview = (title, index) => ({
  clientName: customerProfiles[index % customerProfiles.length],
  platform: reviewPlatforms[index % reviewPlatforms.length],
  rating: index % 3 === 0 ? 4 : 5,
  comment: reviewMessages[index % reviewMessages.length].replace("{phone}", title),
  reviewedAt: new Date(2025, index % 12, (index % 27) + 1),
  isSample: true,
});

const createCustomerReviews = (title, phoneIndex) =>
  Array.from({ length: 8 }, (_, reviewIndex) =>
    createCustomerReview(title, phoneIndex * 8 + reviewIndex)
  );

const phoneData = catalog.map(
  ([title, brand, modelVariant, storageVariant, minPrice, maxPrice, releaseYear], index) => ({
  title,
  slug: `${brand}-${title}-${storageVariant}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, ""),
  brand,
  modelVariant,
  storageVariant,
  minPrice,
  maxPrice,
  releaseYear,
  country: "Pakistan",
  images: [
    `http://localhost:${process.env.PORT || 5000}/images/seed-phones/phone-${String(index + 1).padStart(2, "0")}.png`,
  ],
  availabilitySummary: "Available now",
  salesCount: sampleSalesCounts[title] || 300 + ((index * 73) % 560),
  videoReviews: [createYouTubeReview(title)],
  customerReviews: createCustomerReviews(title, index),
  stores: [
    {
      storeName: "PriceOye",
      sellerName: "PriceOye",
      price: minPrice,
      availability: "In stock",
      productUrl: "https://priceoye.pk/",
    },
    {
      storeName: "Telemart",
      sellerName: "Telemart",
      price: maxPrice,
      availability: "In stock",
      productUrl: "https://telemart.pk/",
    },
  ],
  offerCount: 2,
  seedSource: "local-seed",
  lastSyncedAt: new Date(),
  sheetUpdatedAt: new Date(),
  syncBatchId: "local-catalog-seed-v2",
}));

const seedDatabase = async () => {
  try {
    await ConnectDB();

    const result = await Phone.bulkWrite(
      phoneData.map((phone) => ({
        updateOne: {
          filter: { slug: phone.slug },
          update: { $set: phone },
          upsert: true,
        },
      }))
    );

    console.log(
      `Seed complete: ${result.upsertedCount} added, ${result.modifiedCount} updated, ${phoneData.length} total seed records.`
    );
  } catch (error) {
    console.error("Database seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedDatabase();
