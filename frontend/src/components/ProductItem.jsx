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
      className="group block overflow-hidden rounded-[1.5rem] border border-black/[0.07] bg-white p-2.5 text-[#1d1d1f] shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(0,0,0,0.1)]"
    >
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[1.15rem] bg-[#f5f5f7] p-5">
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#6e6e73] shadow-sm">
          {releaseYear || "New"}
        </span>
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
      <div className="space-y-2 px-2 pb-2 pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6e6e73]">
          {brand || "Unknown brand"}
        </p>
        <p className="min-h-12 text-[17px] font-semibold leading-6 tracking-[-0.02em]">{name}</p>
        <div className="flex items-center justify-between gap-2 pt-1">
          <p className="text-xs text-[#6e6e73]">{availabilitySummary}</p>
          <p className="whitespace-nowrap text-sm font-semibold text-[#1d1d1f]">{priceLabel}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
