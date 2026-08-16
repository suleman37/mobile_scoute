import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import dropdown from "../assets/frontend_assets/dropdown_icon.png";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = ({
  titleText1 = "PAKISTAN",
  titleText2 = "IPHONES",
  productsOverride,
  productsLoadingOverride,
  productsErrorOverride,
  descriptionText = "Loaded Pakistan phone entries from the local API catalog.",
  emptyMessage = "No mobiles matched the current filters.",
}) => {
  const { products, search, productsLoading, productsError, pagination } =
    useContext(ShopContext);
  const shouldUseContextPagination = productsOverride === undefined;
  const catalogProducts = productsOverride ?? products;
  const catalogLoading = productsLoadingOverride ?? productsLoading;
  const catalogError = productsErrorOverride ?? productsError;
  const catalogPagination = shouldUseContextPagination ? pagination : null;
  const [showFilter, setShowFilter] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedStores, setSelectedStores] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  const availableBrands = [...new Set(catalogProducts.map((product) => product.brand))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
  const availableStores = [
    ...new Set(
      catalogProducts.flatMap((product) =>
        (product.stores || []).map((store) => store.storeName)
      )
    ),
  ]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  const getSortablePrice = (product, sortDirection) => {
    if (product.hasPrice) {
      return product.price;
    }

    return sortDirection === "low-high" ? Number.MAX_SAFE_INTEGER : -1;
  };

  const sortProduct = () => {
    let sortedProducts = filteredProducts.slice();

    switch (sortType) {
      case "low-high":
        sortedProducts.sort(
          (a, b) => getSortablePrice(a, sortType) - getSortablePrice(b, sortType)
        );
        break;
      case "high-low":
        sortedProducts.sort(
          (a, b) => getSortablePrice(b, sortType) - getSortablePrice(a, sortType)
        );
        break;
      case "az":
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "za":
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        sortedProducts.sort((a, b) => b.date - a.date);
        break;
    }
    return sortedProducts;
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleBrandChange = (event) => {
    const { value, checked } = event.target;
    setSelectedBrands((prev) =>
      checked ? [...prev, value] : prev.filter((brand) => brand !== value)
    );
  };

  const handleStoreChange = (event) => {
    const { value, checked } = event.target;
    setSelectedStores((prev) =>
      checked ? [...prev, value] : prev.filter((store) => store !== value)
    );
  };

  const filteredProducts = catalogProducts.filter((product) => {
    const brandMatch =
      selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const storeMatch =
      selectedStores.length === 0 ||
      product.stores?.some((store) => selectedStores.includes(store.storeName));
    const searchMatch =
      search === "" || product.searchIndex.includes(search.toLowerCase());

    return brandMatch && storeMatch && searchMatch;
  });

  const sortedProducts = sortProduct();

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      <div className="min-w-60">
        <p
          className="my-2 text-xl filter items-center cursor-pointer gap-2 flex"
          onClick={toggleFilter}
        >
          FILTERS
          <img
            src={dropdown}
            alt="Arrow"
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
          />
        </p>
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden sm:block"
          }`}
        >
          <p className="mb-3 text-sm font-medium">BRAND</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {availableBrands.map((brand) => (
              <label className="flex gap-2" key={brand}>
                <input
                  className="w-3"
                  type="checkbox"
                  value={brand}
                  onChange={handleBrandChange}
                />
                {brand}
              </label>
            ))}
          </div>
        </div>

        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 my-5 ${
            showFilter ? "" : "hidden sm:block"
          }`}
        >
          <p className="mb-3 text-sm font-medium">STORE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {availableStores.map((store) => (
              <label className="flex gap-2" key={store}>
                <input
                  className="w-3"
                  type="checkbox"
                  value={store}
                  onChange={handleStoreChange}
                />
                {store}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-base sm:text-2xl">
          <div>
            <Title text1={titleText1} text2={titleText2} />
            <p className="text-sm text-gray-500">{descriptionText}</p>
            {catalogPagination && (
              <p className="text-sm text-gray-500">
                Loaded {catalogPagination.loadedItems || catalogProducts.length} entries from{" "}
                {catalogPagination.totalPages || 1} API page
                {catalogPagination.totalPages === 1 ? "" : "s"}.
              </p>
            )}
          </div>
          {sortedProducts.length > 0 && (
            <select
              className="border-2 border-gray-100 text-sm px-2"
              onChange={(e) => setSortType(e.target.value)}
            >
              <option value="relevant">Sort by: Recently synced</option>
              <option value="az">Sort by: Name A-Z</option>
              <option value="za">Sort by: Name Z-A</option>
              <option value="low-high">Sort by: Price low to high</option>
              <option value="high-low">Sort by: Price high to low</option>
            </select>
          )}
        </div>
        {catalogLoading && (
          <div className="rounded-lg border border-gray-200 px-6 py-10 text-sm text-gray-600">
            Loading mobiles from API...
          </div>
        )}
        {!catalogLoading && catalogError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-10 text-sm text-red-700">
            {catalogError}
          </div>
        )}
        {!catalogLoading && !catalogError && sortedProducts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
            {sortedProducts.map((item, index) => (
              <ProductItem
                key={index}
                _id={item._id}
                name={item.name}
                priceLabel={item.priceLabel}
                image={item.image}
                releaseYear={item.releaseYear}
                brand={item.brand}
                variantLabel={item.variantLabel}
                availabilitySummary={item.availabilitySummary}
              />
            ))}
          </div>
        )}
        {!catalogLoading && !catalogError && sortedProducts.length === 0 && (
          <div className="rounded-lg border border-gray-200 px-6 py-10 text-sm text-gray-600">
            {emptyMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
