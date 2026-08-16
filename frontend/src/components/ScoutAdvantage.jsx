import React, { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import { ShopContext } from "../context/ShopContext";

const categories = [
  { label: "iPhone", brand: "Apple", path: "/iphone" },
  { label: "Samsung", brand: "Samsung", path: "/android" },
  { label: "Google Pixel", brand: "Google", path: "/android" },
  { label: "Xiaomi", brand: "Xiaomi", path: "/android" },
  { label: "OnePlus", brand: "OnePlus", path: "/android" },
  { label: "Nothing", brand: "Nothing", path: "/android" },
  { label: "vivo", brand: "vivo", path: "/android" },
  { label: "realme", brand: "realme", path: "/android" },
];

const ScoutAdvantage = () => {
  const { products } = useContext(ShopContext);
  const categoryTiles = useMemo(
    () =>
      categories.map((category) => ({
        ...category,
        image: products.find((product) => product.brand?.toLowerCase() === category.brand.toLowerCase())?.image?.[0],
      })),
    [products]
  );

  return (
    <section className="my-14 overflow-hidden rounded-[10px] bg-[#f5f5f7] px-6 py-9 sm:px-10 sm:py-12">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#6e6e73]">MobileScout Store</p>
          <h2 className="mt-2 text-4xl font-semibold tracking-[-0.055em] text-[#1d1d1f] sm:text-5xl">Explore mobiles.</h2>
        </div>
        <div className="pt-1 text-left sm:max-w-64 sm:text-right">
          <p className="text-xl font-semibold leading-6 tracking-[-0.03em] text-[#1d1d1f]">The smarter way to find a phone you love.</p>
          <div className="mt-4 flex flex-col gap-2 text-sm font-medium text-[#0071e3] sm:items-end">
            <Link to="/android" className="inline-flex items-center gap-1 hover:underline">Compare Android phones <FiArrowUpRight /></Link>
            <Link to="/iphone" className="inline-flex items-center gap-1 hover:underline">Explore iPhone catalog <FiArrowUpRight /></Link>
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden pb-3">
        <div className="brand-marquee flex w-max gap-4 hover:[animation-play-state:paused]">
        {[...categoryTiles, ...categoryTiles].map((category, index) => (
          <Link
            key={`${category.brand}-${index}`}
            to={category.path}
            className="group flex min-w-[108px] flex-col items-center text-center sm:min-w-[120px]"
            tabIndex={index >= categoryTiles.length ? -1 : undefined}
            aria-hidden={index >= categoryTiles.length}
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-[10px] bg-white p-3 shadow-[0_8px_20px_rgba(17,17,17,0.05)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_14px_24px_rgba(17,17,17,0.12)] sm:h-28 sm:w-28">
              {category.image ? (
                <img src={category.image} alt={`${category.label} phones`} className="h-full w-full object-contain" />
              ) : (
                <span className="text-sm font-semibold text-[#6e6e73]">{category.label}</span>
              )}
            </div>
            <span className="mt-3 text-sm font-semibold text-[#1d1d1f]">{category.label}</span>
          </Link>
        ))}
        </div>
      </div>
    </section>
  );
};

export default ScoutAdvantage;
