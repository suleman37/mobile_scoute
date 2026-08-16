import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Title from "../components/Title";
import NewsLetter from "../components/NewsLetter";
import PlatformInsights from "../components/PlatformInsights";
import { ShopContext } from "../context/ShopContext";

const buildExcerpt = (product) => {
  const parts = [
    product.availabilitySummary,
    product.priceLabel !== "Price not listed" ? product.priceLabel : null,
    product.primaryStore?.storeName
      ? `Source: ${product.primaryStore.storeName}`
      : null,
  ].filter(Boolean);

  return parts.join(". ") + ".";
};

const Avalibility = () => {
  const { products, productsLoading, productsError } = useContext(ShopContext);

  const latestEntries = [...products]
    .sort((a, b) => b.date - a.date)
    .slice(0, 6);

  return (
    <>
      <div className="py-12">
        <div className="mb-10 rounded-[2rem] bg-[#1d1d1f] px-6 py-10 text-center text-white shadow-[0_24px_50px_rgba(0,0,0,0.14)] sm:px-10 sm:py-14">
          <Title text1={"AVAILABILITY"} text2={"UPDATES"} light />
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">Market intelligence, made clear.</h1>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-white/65 sm:text-base">
            Fresh catalog updates from the shared API response, arranged in a
            cleaner story-style layout so visitors can scan brand, pricing, and
            stock status from the new `offers` and `availabilitySummary`
            structure at a glance.
          </p>
        </div>

        <PlatformInsights />

        <div className="mb-7 mt-16 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Title text1="LIVE" text2="CATALOG UPDATES" />
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#1d1d1f]">Recently refreshed devices.</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#6e6e73]">
            Review the latest availability, price snapshots and source listings in one place.
          </p>
        </div>

        {productsLoading && (
          <div className="rounded-2xl border border-gray-200 px-6 py-10 text-sm text-gray-600">
            Loading availability updates...
          </div>
        )}

        {!productsLoading && productsError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-sm text-red-700">
            {productsError}
          </div>
        )}

        {!productsLoading && !productsError && latestEntries.length > 0 && (
          <div className="space-y-5">
            {latestEntries.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="group grid overflow-hidden rounded-[1.5rem] border border-black/[0.07] bg-white transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(17,17,17,0.08)] md:grid-cols-[24%_76%]"
              >
                <div className="flex h-[220px] items-center justify-center bg-[#f5f5f7] p-4">
                  <img
                    src={product.image?.[0]}
                    alt={product.name}
                    className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="flex min-h-[220px] flex-col px-5 py-5 sm:px-7 sm:py-6">
                  <div>
                    <h2 className="max-w-3xl text-2xl font-medium leading-tight text-[#2d2d2d] sm:text-[2.1rem]">
                      {product.name}
                    </h2>
                    <p className="mt-4 max-w-3xl text-base leading-8 text-[#4d4d4d] sm:text-[1.15rem]">
                      {buildExcerpt(product)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!productsLoading && !productsError && latestEntries.length === 0 && (
          <div className="rounded-2xl border border-gray-200 px-6 py-10 text-sm text-gray-600">
            No availability updates are available right now.
          </div>
        )}
      </div>

      <NewsLetter />
    </>
  );
};

export default Avalibility;
