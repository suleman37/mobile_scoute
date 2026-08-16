import React from "react";
import { Link } from "react-router-dom";

const ProductItem = ({
  _id,
  name,
  priceLabel,
  image,
  brand,
  releaseYear,
  variantLabel,
  availabilitySummary,
}) => {
  return (
    <Link
      to={`/product/${_id}`}
      className="group block rounded-2xl border border-gray-200 bg-white p-3 text-gray-800 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="aspect-square overflow-hidden rounded-2xl bg-[#f7f7f7] p-4 flex items-center justify-center">
        {image?.[0] ? (
          <img
            className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
            src={image[0]}
            alt={name}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-center text-xs uppercase tracking-[0.2em] text-gray-400">
            No image
          </div>
        )}
      </div>
      <div className="space-y-2 px-1 pb-1 pt-4">
        <p className="text-xs uppercase tracking-[0.22em] text-gray-400">
          {brand || "Unknown brand"} • {releaseYear || variantLabel}
        </p>
        <p className="text-base font-semibold leading-6">{name}</p>
        <p className="text-sm text-gray-600">{availabilitySummary}</p>
        <p className="text-sm font-medium text-black">{priceLabel}</p>
      </div>
    </Link>
  );
};

export default ProductItem;
