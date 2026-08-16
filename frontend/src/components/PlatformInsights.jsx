import React, { useContext, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const currencyFormatter = new Intl.NumberFormat("en-PK", {
  maximumFractionDigits: 0,
});

const formatCompactPrice = (price) =>
  price >= 1000 ? `PKR ${(price / 1000).toFixed(0)}k` : `PKR ${price}`;

const PlatformInsights = () => {
  const { products, productsLoading } = useContext(ShopContext);

  const insights = useMemo(() => {
    const stores = new Map();
    const feedbackPlatforms = new Map();

    products.forEach((product) => {
      (product.stores || []).forEach((store) => {
        if (!store.storeName || typeof store.price !== "number") {
          return;
        }

        const current = stores.get(store.storeName) || { totalPrice: 0, listings: 0 };
        current.totalPrice += store.price;
        current.listings += 1;
        stores.set(store.storeName, current);
      });

      (product.customerReviews || []).forEach((review) => {
        if (!review.platform || typeof review.rating !== "number") {
          return;
        }

        const current = feedbackPlatforms.get(review.platform) || {
          ratingTotal: 0,
          reviews: 0,
        };
        current.ratingTotal += review.rating;
        current.reviews += 1;
        feedbackPlatforms.set(review.platform, current);
      });
    });

    const pricePlatforms = [...stores.entries()]
      .map(([name, values]) => ({
        name,
        averagePrice: Math.round(values.totalPrice / values.listings),
        listings: values.listings,
      }))
      .sort((a, b) => a.averagePrice - b.averagePrice);
    const preferencePlatforms = [...feedbackPlatforms.entries()]
      .map(([name, values]) => ({
        name,
        averageRating: values.ratingTotal / values.reviews,
        reviews: values.reviews,
      }))
      .sort((a, b) => b.averageRating - a.averageRating || b.reviews - a.reviews);
    const topSellingPhones = products
      .map((product) => ({
        name: product.name,
        salesCount: product.salesCount || 0,
        prices: (product.stores || []).reduce((result, store) => {
          if (store.storeName && typeof store.price === "number") {
            result[store.storeName] = store.price;
          }
          return result;
        }, {}),
      }))
      .filter((product) => product.salesCount > 0)
      .sort((a, b) => b.salesCount - a.salesCount)
      .slice(0, 3);

    return { pricePlatforms, preferencePlatforms, topSellingPhones };
  }, [products]);

  if (productsLoading || !products.length) {
    return null;
  }

  const maxPrice = Math.max(...insights.pricePlatforms.map((item) => item.averagePrice), 1);
  const preferredStore = insights.pricePlatforms[0];
  const mostLiked = insights.preferencePlatforms[0];
  const highestTopPhonePrice = Math.max(
    ...insights.topSellingPhones.flatMap((phone) => Object.values(phone.prices)),
    1
  );

  return (
    <section className="my-16 rounded-[2rem] border border-black/[0.06] bg-white p-5 shadow-[0_15px_40px_rgba(0,0,0,0.04)] sm:p-8">
      <div className="text-center">
        <Title text1="MARKETPLACE" text2="INSIGHTS" />
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#1d1d1f] sm:text-4xl">Make a more confident choice.</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#6e6e73]">
          Compare average listed prices and customer-feedback scores across platforms.
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-gray-900">Price comparison</h3>
              <p className="mt-1 text-xs text-gray-500">Lower average price is more budget-friendly.</p>
            </div>
            {preferredStore && (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                Best: {preferredStore.name}
              </span>
            )}
          </div>
          <div className="mt-8 flex h-44 items-end justify-around gap-6 border-b border-gray-200 px-3">
            {insights.pricePlatforms.map((platform) => (
              <div key={platform.name} className="flex h-full flex-1 flex-col justify-end text-center">
                <p className="mb-2 text-xs font-medium text-gray-700">
                  PKR {currencyFormatter.format(platform.averagePrice)}
                </p>
                <div
                  className="mx-auto w-full max-w-24 rounded-t-xl bg-gradient-to-t from-[#1f2937] to-[#64748b]"
                  style={{ height: `${Math.max((platform.averagePrice / maxPrice) * 100, 12)}%` }}
                />
                <p className="mt-3 text-xs font-semibold text-gray-800">{platform.name}</p>
                <p className="mt-1 text-[11px] text-gray-400">{platform.listings} listings</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-gray-900">Customer preference</h3>
              <p className="mt-1 text-xs text-gray-500">Based on average ratings from listed feedback.</p>
            </div>
            {mostLiked && (
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                Most liked: {mostLiked.name}
              </span>
            )}
          </div>
          <div className="mt-6 space-y-4">
            {insights.preferencePlatforms.map((platform) => (
              <div key={platform.name}>
                <div className="flex items-center justify-between gap-3 text-xs">
                  <p className="font-medium text-gray-800">{platform.name}</p>
                  <p className="whitespace-nowrap text-amber-500">
                    {platform.averageRating.toFixed(1)} ★
                    <span className="ml-1 text-gray-400">({platform.reviews})</span>
                  </p>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                    style={{ width: `${(platform.averageRating / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {insights.topSellingPhones.length > 0 && (
        <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Top 3 best-selling mobiles: price comparison</h3>
              <p className="mt-1 text-xs text-gray-500">
                Each pair compares current listed prices for the most popular seeded catalog mobiles.
              </p>
            </div>
            <div className="flex gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded-sm bg-amber-400" />PriceOye</span>
              <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded-sm bg-emerald-600" />Telemart</span>
            </div>
          </div>
          <div className="mt-7 grid grid-cols-3 gap-3 border-b border-gray-200 sm:gap-8">
            {insights.topSellingPhones.map((phone) => (
              <div key={phone.name} className="min-w-0 text-center">
                <p className="mb-3 text-xs font-semibold text-gray-700">{phone.salesCount.toLocaleString()} sales</p>
                <div className="flex h-48 items-end justify-center gap-2 sm:gap-3">
                  {[
                    { name: "PriceOye", color: "bg-amber-400" },
                    { name: "Telemart", color: "bg-emerald-600" },
                  ].map((store) => {
                    const price = phone.prices[store.name];
                    if (!price) return null;

                    return (
                      <div key={store.name} className="flex h-full w-1/2 max-w-20 items-end">
                        <div
                          className={`relative w-full rounded-t-lg ${store.color}`}
                          style={{ height: `${Math.max((price / highestTopPhonePrice) * 100, 12)}%` }}
                        >
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-gray-600">
                            {formatCompactPrice(price)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-3 truncate text-xs font-semibold text-gray-800 sm:text-sm">{phone.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <p className="mt-5 text-center text-[11px] text-gray-400">
        Ratings and sales use seeded sample catalog data.
      </p>
    </section>
  );
};

export default PlatformInsights;
