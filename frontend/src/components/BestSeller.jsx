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
      <div className="my-10">
        <div className="text-center py-8 text-3xl">
          <Title text1={"NEWER"} text2={"GENERATIONS"} />
          <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
            A secondary strip sourced from the same normalized catalog payload,
            separated from the latest sync grid so Home shows broader device
            coverage without repeating the same cards.
          </p>
        </div>
        {latestProduct.length > 0 && (
          <div className="flex gap-4 overflow-x-auto pb-2">
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
      </div>
    </>
  );
};

export default BestSeller;
