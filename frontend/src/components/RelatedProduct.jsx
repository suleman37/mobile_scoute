import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from "./Title";
import ProductItem from "./ProductItem";

const RelatedProduct = ({ category, currentId }) => {
    const {products} = useContext(ShopContext);
    const [related , setRelated] = useState([]);

    useEffect(()=>{
        if (products && products.length > 0) {
            let ProductCopy  = products.slice();
            ProductCopy = ProductCopy.filter((item) => item._id !== currentId);
            ProductCopy = ProductCopy.filter((item)=>category === item.category);
            setRelated(ProductCopy.slice(0,5));
        } else {
            setRelated([]);
        }
    }, [products, category, currentId]);

  if (!related.length) {
    return null;
  }

  return (
    <>
      <div className="my-24">
        <div className="text-center text-3xl py-2">
            <Title text1={"RELATED"} text2={"ENTRIES"}/>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
            {related.map((item , index) => (
                <ProductItem
                  key={index}
                  _id={item._id}
                  name={item.name}
                  priceLabel={item.priceLabel}
                  image={item.image}
                  brand={item.brand}
                  releaseYear={item.releaseYear}
                  variantLabel={item.variantLabel}
                  availabilitySummary={item.availabilitySummary}
                />
            ))}
        </div>
      </div>
    </>
  )
}

export default RelatedProduct;
