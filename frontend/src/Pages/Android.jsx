import React, { useContext } from "react";
import Collection from "./Collection";
import { ShopContext } from "../context/ShopContext";

const Android = () => {
  const { products } = useContext(ShopContext);
  const androidProducts = products.filter(
    (product) => product.platform === "Android"
  );

  return (
    <Collection
      titleText1="ANDROID"
      titleText2="CATALOG"
      productsOverride={androidProducts}
      descriptionText="This page stays on the same frontend layout, but the current app is calling only the pakistan-iphones API."
      emptyMessage="No Android phones are available because the current data source is limited to pakistan-iphones."
    />
  );
};

export default Android;
