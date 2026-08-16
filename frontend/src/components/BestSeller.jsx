import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../components/ProductItem";
import Title from "./Title";

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [latestProduct, setlatestProduct] = useState([]);
  useEffect(() => {
    const latestSyncIds = new Set(
      [...products]
        .sort((a, b) => b.date - a.date)
        .slice(0, 20)
        .map((item) => item._id)
    );

    const usedImages = new Set();
    const nextGenerationPhones = [...products]
      .filter((item) => !latestSyncIds.has(item._id))
      .sort((a, b) => {
        if ((b.releaseYear || 0) !== (a.releaseYear || 0)) {
          return (b.releaseYear || 0) - (a.releaseYear || 0);
        }

        return b.date - a.date;
      })
      .filter((item) => {
        const imageKey = item.image?.[0] || item._id;

        if (usedImages.has(imageKey)) {
          return false;
        }

        usedImages.add(imageKey);
        return true;
      })
      .slice(0, 5);

    setlatestProduct(nextGenerationPhones);
  }, [products]);

  return (
    <>
      <section className="my-16 overflow-hidden rounded-[2rem] bg-[#e8edf9] px-5 py-10 sm:px-8 sm:py-14">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
          <Title text1={"NEWER"} text2={"GENERATIONS"} />
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#1d1d1f] sm:text-4xl">Explore what's next.</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#555b69]">
            A focused selection of newer generations from across the MobileScout catalog.
          </p>
        </div>
        {latestProduct.length > 0 && (
          <div className="mt-8 flex gap-4 overflow-x-auto pb-2">
            {latestProduct.map((item, index) => {
              return (
                <div className="min-w-[220px] flex-1" key={index}>
                  <ProductItem
                    _id={item._id}
                    name={item.name}
                    priceLabel={item.priceLabel}
                    image={item.image}
                    releaseYear={item.releaseYear}
                    variantLabel={item.variantLabel}
                    availabilitySummary={item.availabilitySummary}
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
};

export default BestSeller;
