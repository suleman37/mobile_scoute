import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Title from "../components/Title";
import NewsLetter from "../components/NewsLetter";
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
      <div className="border-t pt-8">
        <div className="mb-8 text-center text-2xl">
          <Title text1={"AVAILABILITY"} text2={"UPDATES"} />
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-gray-500 sm:text-base">
            Fresh catalog updates from the shared API response, arranged in a
            cleaner story-style layout so visitors can scan brand, pricing, and
            stock status from the new `offers` and `availabilitySummary`
            structure at a glance.
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
          <div className="space-y-4">
            {latestEntries.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="group grid overflow-hidden border border-gray-300 bg-white transition hover:border-gray-400 hover:shadow-[0_14px_40px_rgba(17,17,17,0.08)] md:grid-cols-[24%_76%]"
              >
                <div className="flex h-[220px] items-center justify-center bg-[#f4f4f4] p-4">
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
