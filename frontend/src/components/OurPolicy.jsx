import React from "react";
import exchange from "../assets/frontend_assets/exchange_icon.png";
import quality from "../assets/frontend_assets/quality_icon.png";
import support from "../assets/frontend_assets/support_img.png";

const OurPolicy = () => {
  const items = [
    {
      icon: exchange,
      title: "Structured API Data",
      description:
        "Every iPhone entry keeps its original title, store list, sync batch, and pagination context.",
    },
    {
      icon: quality,
      title: "Clean Catalog Layout",
      description:
        "MobileScout now reads as a reference website, not a checkout experience.",
    },
    {
      icon: support,
      title: "Store Snapshot View",
      description:
        "Availability and price details are shown as source references from WhatMobile, PriceOye, and Shophive.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl py-16 sm:py-20">
      <div className="grid grid-cols-1 gap-10 text-center sm:grid-cols-3 sm:gap-8">
        {items.map((item) => (
          <div key={item.title} className="mx-auto max-w-sm px-4">
            <div className="mb-4 flex justify-center">
              <img src={item.icon} alt={item.title} className="h-10 w-10 object-contain" />
            </div>
            <p className="text-lg font-semibold text-gray-900">{item.title}</p>
            <p className="mt-2 text-base leading-7 text-gray-400">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurPolicy;
