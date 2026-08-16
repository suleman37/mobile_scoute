import React, { useContext } from "react";
import Collection from "./Collection";
import { ShopContext } from "../context/ShopContext";

const Iphone = () => {
  const { products } = useContext(ShopContext);
  const iphoneProducts = products.filter(
    (product) => product.platform === "iPhone"
  );

  return (
    <Collection
      titleText1="IPHONE"
      titleText2="CATALOG"
      productsOverride={iphoneProducts}
      descriptionText="Apple entries are being filtered from the shared pakistan-iphones catalog response."
      emptyMessage="No iPhone entries matched the current filters."
    />
  );
};

export default Iphone;

