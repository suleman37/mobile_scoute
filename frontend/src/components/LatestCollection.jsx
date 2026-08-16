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
      <section className="my-16">
        <div className="flex flex-col gap-3 py-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
          <Title text1={"LATEST"} text2={"SYNC"} />
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#1d1d1f] sm:text-4xl">Fresh from the catalog.</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#6e6e73]">
            Browse newly synced mobiles with current store prices, availability and model details.
          </p>
        </div>
        {latestProduct.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
      </section>
    </>
  );
};

export default LatestCollection;
