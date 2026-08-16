import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import RelatedProduct from "../components/RelatedProduct";

const formatDate = (value) => {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleString();
};

const Product = () => {
  const { id } = useParams();
  const { products } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const customerReviewsRef = useRef(null);

  const scrollCustomerReviews = (direction) => {
    const carousel = customerReviewsRef.current;

    if (!carousel) {
      return;
    }

    carousel.scrollBy({
      left: direction * Math.max(carousel.clientWidth * 0.85, 320),
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const product = products.find((item) => item._id === id);
    if (product) {
      setProductData(product);
      setImage(product.image?.[0] || "");
    } else {
      setProductData(null);
      setImage("");
    }
  }, [id, products]);

  return productData ? (
    <div className="py-10 transition-opacity duration-500 ease-in opacity-100">
      <div className="flex flex-col gap-8 rounded-[10px] border border-black/[0.07] bg-white p-4 shadow-[0_18px_45px_rgba(0,0,0,0.04)] sm:flex-row sm:gap-10 sm:p-8">
        <div className="flex flex-1 flex-col-reverse gap-3 sm:flex-row">
          <div className="flex w-full justify-between overflow-x-auto sm:w-[18.7%] sm:flex-col sm:justify-normal sm:overflow-y-scroll">
            {(productData.image || []).map((item, index) => (
              <img
                src={item}
                alt={`Product ${index + 1}`}
                key={index}
                className="w-[24%] cursor-pointer rounded-[10px] border border-black/[0.06] bg-[#f5f5f7] p-1 sm:mb-3 sm:w-full"
                onClick={() => setImage(item)}
              />
            ))}
          </div>
          <div className="flex w-full items-center justify-center rounded-[10px] bg-[#f5f5f7] p-4 sm:w-[80%]">
            {image ? (
              <img src={image} alt="Selected product" className="h-auto w-full rounded-[10px]" />
            ) : (
              <div className="flex min-h-[420px] items-center justify-center rounded-[10px] bg-[#f7f7f7] text-sm uppercase tracking-[0.25em] text-gray-400">
                No image available
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 py-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#6e6e73]">{productData.brand}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-[#1d1d1f] sm:text-4xl">{productData.name}</h1>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#6e6e73]">
            {productData.brand} • {productData.variantLabel} • {productData.availabilitySummary}
          </p>
          <p className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-[#1d1d1f]">{productData.priceLabel}</p>
          <p className="mt-5 leading-7 text-[#6e6e73] md:w-4/5">
            MobileScout is currently using the pakistan-iphones API. This page
            maps the catalog entry into a cleaner detail view while preserving
            sync timestamps, price range, store listings, and availability data.
          </p>
          <div className="mt-7 grid grid-cols-2 gap-3 md:w-4/5">
            <div className="rounded-[10px] border border-black/[0.07] bg-[#fbfbfc] p-3">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Brand
              </p>
              <p className="text-sm text-gray-700 mt-1">{productData.brand}</p>
            </div>
            <div className="border border-gray-200 rounded-[10px] p-3">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Slug
              </p>
              <p className="text-sm text-gray-700 mt-1">{productData.slug || "Not available"}</p>
            </div>
            <div className="border border-gray-200 rounded-[10px] p-3">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Lowest Price
              </p>
              <p className="text-sm text-gray-700 mt-1">
                {productData.formattedMinPrice || "Price not listed"}
              </p>
            </div>
            <div className="border border-gray-200 rounded-[10px] p-3">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Highest Price
              </p>
              <p className="text-sm text-gray-700 mt-1">
                {productData.formattedMaxPrice || "Price not listed"}
              </p>
            </div>
            <div className="border border-gray-200 rounded-[10px] p-3">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Offer Count
              </p>
              <p className="text-sm text-gray-700 mt-1">
                {productData.offerCount || productData.stores.length}
              </p>
            </div>
            <div className="border border-gray-200 rounded-[10px] p-3">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Last Synced
              </p>
              <p className="text-sm text-gray-700 mt-1">
                {formatDate(productData.lastSyncedAt)}
              </p>
            </div>
            <div className="border border-gray-200 rounded-[10px] p-3">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Sheet Updated
              </p>
              <p className="text-sm text-gray-700 mt-1">
                {formatDate(productData.sheetUpdatedAt)}
              </p>
            </div>
            <div className="border border-gray-200 rounded-[10px] p-3">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Sync Batch
              </p>
              <p className="text-sm text-gray-700 mt-1 break-all">
                {productData.syncBatchId || "Not available"}
              </p>
            </div>
          </div>
          <div className="my-8">
            <hr className="mb-8" />
            <div className="flex flex-col gap-4">
              {productData.stores.map((store) => (
                <div
                  key={`${productData._id}-${store.storeName}-${store.productUrl || "store"}`}
                  className="rounded-[10px] border border-gray-200 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-base font-semibold">{store.storeName}</p>
                      <p className="text-sm text-gray-500">{store.availability}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm font-medium text-black">
                        {store.priceLabel}
                      </p>
                      <p className="text-xs text-gray-500">
                        {store.sellerName || "Seller not specified"}
                      </p>
                    </div>
                  </div>
                  {store.productUrl && (
                    <a
                      className="mt-3 inline-flex text-sm font-medium text-black underline underline-offset-4"
                      href={store.productUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open source listing
                    </a>
                  )}
                </div>
              ))}
            </div>
            {productData.videoReviews?.[0]?.url && (
              <a
                className="mt-4 flex items-center justify-between rounded-[10px] border border-red-100 bg-red-50/40 p-4 transition-colors hover:border-red-500"
                href={productData.videoReviews[0].url}
                target="_blank"
                rel="noreferrer"
              >
                <span>
                  <span className="block font-semibold text-gray-900">
                    Watch {productData.name} video review
                  </span>
                  <span className="mt-1 block text-sm text-gray-500">
                    YouTube
                  </span>
                </span>
                <span className="text-sm font-medium text-red-600">Watch on YouTube →</span>
              </a>
            )}
          </div>
        </div>
      </div>
      {productData.customerReviews?.length > 0 && (
        <section className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Customer feedback</h2>
              <p className="mt-1 text-sm text-gray-500">
                Seeded sample feedback from different platforms.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scrollCustomerReviews(-1)}
                aria-label="Show previous customer reviews"
                className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-gray-200 text-gray-700 transition-colors hover:border-black hover:bg-black hover:text-white"
              >
                <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => scrollCustomerReviews(1)}
                aria-label="Show next customer reviews"
                className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-gray-200 text-gray-700 transition-colors hover:border-black hover:bg-black hover:text-white"
              >
                <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
          <div ref={customerReviewsRef} className="mt-5 flex gap-4 overflow-x-auto scroll-smooth pb-1">
            {productData.customerReviews.map((review, index) => (
              <article
                key={`${productData._id}-customer-review-${index}`}
                className="w-full shrink-0 rounded-[10px] border border-gray-200 p-5 sm:w-[calc((100%-1rem)/2)] xl:w-[calc((100%-3rem)/4)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-gray-900">{review.clientName}</p>
                  <p className="whitespace-nowrap text-sm font-medium text-amber-500">
                    {"★".repeat(review.rating || 0)}
                    <span className="ml-1 text-gray-500">{review.rating}/5</span>
                  </p>
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">{review.comment}</p>
                <p className="mt-4 text-xs font-medium uppercase tracking-wide text-gray-400">
                  {review.platform}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}
      <div className="mt-20">
        <div className="flex">
          <div className="border px-5 py-3 text-sm">Overview</div>
          <div className="border px-5 py-3 text-sm">API Structure</div>
        </div>
        <div className="border px-5 py-3 flex flex-col gap-4 text-sm text-gray-600">
          <p>
            The frontend is intentionally not using a checkout flow here. Each
            item is presented as a structured catalog entry using the API
            fields returned by `http://localhost:5000/api/pakistan-iphones`.
          </p>
          <p>
            The detail layout exposes linked offers, raw sync metadata, pricing,
            store availability, brand data, and image source information so
            MobileScout works like a reference catalog instead of an e-commerce
            storefront.
          </p>
        </div>
      </div>
      <RelatedProduct category={productData.category} currentId={productData._id} />
    </div>
  ) : (
    <div className="border-t pt-16">
      <div className="rounded-[10px] border border-gray-200 px-6 py-10 text-sm text-gray-600">
        This API entry is not available in the current frontend dataset.
      </div>
    </div>
  );
};

export default Product;
