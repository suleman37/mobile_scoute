import { createContext, useCallback, useEffect, useState } from "react";
import axios from "axios";

export const ShopContext = createContext(null);

const API_BASE_URL = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "");
const PAKISTAN_IPHONES_API = `${API_BASE_URL}/api/pakistan-iphones`;
const currencyFormatter = new Intl.NumberFormat("en-PK");

const isFiniteNumber = (value) =>
  typeof value === "number" && Number.isFinite(value);

const formatCurrency = (value) =>
  isFiniteNumber(value) ? `PKR ${currencyFormatter.format(value)}` : null;

const formatPriceRange = (minPrice, maxPrice) => {
  if (isFiniteNumber(minPrice) && isFiniteNumber(maxPrice)) {
    if (minPrice === maxPrice) {
      return formatCurrency(minPrice);
    }

    return `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`;
  }

  if (isFiniteNumber(minPrice)) {
    return `From ${formatCurrency(minPrice)}`;
  }

  if (isFiniteNumber(maxPrice)) {
    return `Up to ${formatCurrency(maxPrice)}`;
  }

  return "Price not listed";
};

const getImageList = (product) => {
  if (Array.isArray(product.images) && product.images.length) {
    return product.images.filter(Boolean);
  }

  if (product.image?.url) {
    return [product.image.url];
  }

  if (typeof product.image === "string" && product.image) {
    return [product.image];
  }

  return [];
};

const normalizeStores = (stores = []) =>
  stores.map((store) => ({
    ...store,
    storeName: store.storeName || store.store || "Unknown store",
    sellerName: store.sellerName || store.store || store.storeName || "Unknown store",
    priceLabel: formatCurrency(store.price) || "Price not listed",
    hasPrice: isFiniteNumber(store.price),
    isLinked: Boolean(store.productUrl),
  }));

const deriveAvailability = (stores) => {
  const labels = stores.map((store) => store.availability).filter(Boolean);

  if (labels.some((label) => /in stock/i.test(label))) {
    return "Available now";
  }

  if (labels.some((label) => /out of stock/i.test(label))) {
    return "Out of stock";
  }

  if (labels.some((label) => /not listed/i.test(label))) {
    return "Reference only";
  }

  return "Availability unknown";
};

const normalizeProduct = (product) => {
  const stores = normalizeStores(product.stores || product.offers || []);
  const images = getImageList(product);
  const fallbackPrice =
    stores.find((store) => isFiniteNumber(store.price))?.price ?? null;
  const minPrice = isFiniteNumber(product.minPrice)
    ? product.minPrice
    : isFiniteNumber(product.priceMin)
    ? product.priceMin
    : fallbackPrice;
  const maxPrice = isFiniteNumber(product.maxPrice)
    ? product.maxPrice
    : isFiniteNumber(product.priceMax)
    ? product.priceMax
    : fallbackPrice;
  const primaryStore =
    stores.find((store) => store.hasPrice) ||
    stores.find((store) => store.isLinked) ||
    stores[0] ||
    null;
  const availabilitySummary = deriveAvailability(stores);
  const variantParts = [product.modelVariant, product.storageVariant].filter(
    Boolean
  );
  const syncedAt = product.lastSyncedAt || product.updatedAt || product.createdAt;
  const timestamp = syncedAt ? new Date(syncedAt).getTime() : Date.now();
  const brand = product.brand || "Unknown";
  const productTitle =
    product.title || product.phoneName || product.normalizedTitle || "Untitled phone";
  const isApplePhone =
    /apple/i.test(brand) || /iphone/i.test(productTitle) || /iphone/i.test(product.slug);
  const platform = isApplePhone ? "iPhone" : "Android";
  const variantLabel = variantParts.length
    ? variantParts.join(" / ")
    : brand;

  return {
    ...product,
    name: productTitle,
    brand,
    image: images,
    images,
    minPrice,
    maxPrice,
    hasPrice: isFiniteNumber(minPrice) || isFiniteNumber(maxPrice),
    price: minPrice ?? maxPrice ?? 0,
    priceLabel: formatPriceRange(minPrice, maxPrice),
    formattedMinPrice: formatCurrency(minPrice),
    formattedMaxPrice: formatCurrency(maxPrice),
    storageLabel: product.storageVariant || "Base storage not specified",
    variantLabel,
    availabilitySummary: product.availabilitySummary || availabilitySummary,
    primaryStore,
    stores,
    listedStoresCount: stores.length,
    offerCount: product.offerCount || stores.length,
    platform,
    releaseYear: product.releaseYear || null,
    searchIndex: [
      brand,
      product.title,
      product.phoneName,
      product.slug,
      product.normalizedTitle,
      product.modelVariant,
      product.storageVariant,
      product.releaseYear,
      product.searchableText,
      product.country,
      product.availabilitySummary,
      ...stores.map((store) => store.storeName),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase(),
    category: brand,
    type: platform,
    subCategory: platform,
    subcategory: platform,
    date: Number.isNaN(timestamp) ? Date.now() : timestamp,
  };
};

const extractItemsFromPayload = (payload) => {
  if (!payload?.success) {
    return null;
  }

  if (Array.isArray(payload.data)) {
    return {
      items: payload.data,
      pagination:
        payload.pagination || {
          totalItems: payload.count || payload.data.length,
          totalPages: 1,
          page: 1,
          limit: payload.data.length || 0,
        },
    };
  }

  if (Array.isArray(payload.items)) {
    return {
      items: payload.items,
      pagination: payload.pagination || null,
    };
  }

  return null;
};

const ShopContextProvider = (props) => {
  const [search, setSearch] = useState("");
  const [showsearch, setShowSearch] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [pagination, setPagination] = useState(null);
  const [currentLocation, setCurrentLocation] = useState("Detecting location...");
  const [currentCoordinates, setCurrentCoordinates] = useState(null);

  const getProductsData = useCallback(async () => {
    setProductsLoading(true);
    setProductsError("");

    try {
      let allItems = [];

      const firstResponse = await axios.get(PAKISTAN_IPHONES_API);
      const firstPayload = firstResponse.data;
      const firstPage = extractItemsFromPayload(firstPayload);

      if (!firstPage) {
        throw new Error("Invalid pakistan-iphones response");
      }

      allItems = [...firstPage.items];
      const apiPagination = firstPage.pagination || null;
      const totalPages = apiPagination?.totalPages || 1;
      const limit = apiPagination?.limit || firstPage.items.length || 20;

      if (totalPages > 1) {
        const remainingPages = await Promise.all(
          Array.from({ length: totalPages - 1 }, (_, index) =>
            axios.get(PAKISTAN_IPHONES_API, {
              params: {
                page: index + 2,
                limit,
              },
            })
          )
        );

        remainingPages.forEach((response) => {
          const nextPage = extractItemsFromPayload(response.data);

          if (nextPage?.items?.length) {
            allItems = allItems.concat(nextPage.items);
          }
        });
      }

      setProducts(allItems.map(normalizeProduct));
      setPagination({
        ...apiPagination,
        loadedItems: allItems.length,
      });
    } catch (error) {
      setProducts([]);
      setPagination(null);
      setProductsError(
        "Could not load Pakistan iPhone data from the local API."
      );
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    getProductsData();
  }, [getProductsData]);

  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setCurrentLocation("Location unavailable");
      return;
    }

    let isMounted = true;

    const applyFallbackLocation = (latitude, longitude) => {
      if (!isMounted) {
        return;
      }

      setCurrentLocation(
        `Lat ${latitude.toFixed(3)}, Lng ${longitude.toFixed(3)}`
      );
    };

    const resolveLocationName = async (latitude, longitude) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
        );

        if (!response.ok) {
          throw new Error("Reverse geocoding failed");
        }

        const payload = await response.json();
        const address = payload.address || {};
        const parts = [
          address.city ||
            address.town ||
            address.village ||
            address.county ||
            address.state_district,
          address.state,
          address.country,
        ].filter(Boolean);

        if (!isMounted) {
          return;
        }

        setCurrentLocation(parts.length ? parts.join(", ") : payload.display_name || "Location found");
      } catch (error) {
        applyFallbackLocation(latitude, longitude);
      }
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!isMounted) {
          return;
        }

        const { latitude, longitude } = position.coords;
        setCurrentCoordinates({ latitude, longitude });
        resolveLocationName(latitude, longitude);
      },
      () => {
        if (isMounted) {
          setCurrentLocation("Location permission denied");
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    );

    return () => {
      isMounted = false;
    };
  }, []);

  const value = {
    products,
    productsLoading,
    productsError,
    pagination,
    search,
    setSearch,
    showsearch,
    setShowSearch,
    currentLocation,
    currentCoordinates,
    refreshProducts: getProductsData,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
