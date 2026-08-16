import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../components/ProductItem";
import Title from "./Title";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProduct, setlatestProduct] = useState([]);
  useEffect(() => {
    const newestProducts = [...products]
      .sort((a, b) => b.date - a.date)
      .slice(0, 20);
    setlatestProduct(newestProducts);
  }, [products]);

  return (
    <>
      <div className="my-10">
        <div className="text-center py-8 text-3xl">
          <Title text1={"LATEST"} text2={"SYNC"} />
          <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
            The newest entries pulled from the shared catalog response. Each
            card is rendered from the new `data` payload shape with image,
            pricing, and availability already normalized for MobileScout.
          </p>
        </div>
        {latestProduct.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
            {latestProduct.map((item, index) => {
              return (
                <ProductItem
                  key={index}
                  _id={item._id}
                  name={item.name}
                  priceLabel={item.priceLabel}
                  image={item.image}
                  releaseYear={item.releaseYear}
                  variantLabel={item.variantLabel}
                  availabilitySummary={item.availabilitySummary}
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default LatestCollection;
