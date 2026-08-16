import React, { useContext, useMemo } from "react";
import { FiBarChart2, FiCreditCard, FiInfo, FiMessageCircle, FiStar, FiTag } from "react-icons/fi";
import { ShopContext } from "../context/ShopContext";

const money = new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 });

const platformColors = {
  Daraz: "bg-[#f15a24]",
  "Google Reviews": "bg-[#4285f4]",
  Facebook: "bg-[#1877f2]",
  Instagram: "bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]",
  PriceOye: "bg-[#4f46e5]",
  "Mega.pk": "bg-[#0b7183]",
};

const PlatformInsights = () => {
  const { products, productsLoading } = useContext(ShopContext);

  const analytics = useMemo(() => {
    const stores = new Map();
    const platforms = new Map();
    const allPrices = [];
    let reviewsTotal = 0;
    let ratingTotal = 0;
    let latestSync = 0;

    products.forEach((product) => {
      latestSync = Math.max(latestSync, new Date(product.lastSyncedAt || product.updatedAt || 0).getTime() || 0);
      (product.stores || []).forEach((store) => {
        if (!store.storeName || typeof store.price !== "number" || store.price <= 0) return;
        const entry = stores.get(store.storeName) || { total: 0, count: 0 };
        entry.total += store.price;
        entry.count += 1;
        stores.set(store.storeName, entry);
        allPrices.push(store.price);
      });

      (product.customerReviews || []).forEach((review) => {
        if (!review.platform || typeof review.rating !== "number" || review.rating <= 0) return;
        const entry = platforms.get(review.platform) || { ratings: 0, reviews: 0 };
        entry.ratings += review.rating;
        entry.reviews += 1;
        platforms.set(review.platform, entry);
        reviewsTotal += 1;
        ratingTotal += review.rating;
      });
    });

    const storeAverages = [...stores.entries()]
      .map(([name, item]) => ({ name, average: Math.round(item.total / item.count), listings: item.count }))
      .sort((a, b) => a.average - b.average);
    const feedback = [...platforms.entries()]
      .map(([name, item]) => ({ name, rating: item.ratings / item.reviews, reviews: item.reviews }))
      .sort((a, b) => b.reviews - a.reviews);
    const topPhones = products
      .map((product) => ({
        id: product._id,
        name: product.name,
        image: product.image?.[0],
        reviews: (product.customerReviews || []).filter((review) => Number(review.rating) > 0).length,
        syncedAt: new Date(product.lastSyncedAt || product.updatedAt || 0).getTime() || 0,
        prices: (product.stores || []).reduce((result, store) => {
          if (store.storeName && typeof store.price === "number" && store.price > 0) result[store.storeName] = store.price;
          return result;
        }, {}),
      }))
      .filter((product) => Object.keys(product.prices).length)
      .sort((a, b) => b.syncedAt - a.syncedAt)
      .slice(0, 3);

    return {
      storeAverages,
      feedback,
      topPhones,
      averagePrice: allPrices.length ? Math.round(allPrices.reduce((sum, price) => sum + price, 0) / allPrices.length) : null,
      averageRating: reviewsTotal ? ratingTotal / reviewsTotal : null,
      activeListings: allPrices.length,
      reviewsTotal,
      latestSync,
    };
  }, [products]);

  if (productsLoading || !products.length) return null;

  const comparisonSources = analytics.storeAverages.slice(0, 2);
  const [bestStore, nextStore] = comparisonSources;
  const saving = bestStore && nextStore ? Math.max(nextStore.average - bestStore.average, 0) : null;
  const maxPhonePrice = Math.max(...analytics.topPhones.flatMap((phone) => Object.values(phone.prices)), 1);
  const updatedLabel = analytics.latestSync
    ? new Intl.DateTimeFormat("en-PK", { dateStyle: "medium", timeStyle: "short" }).format(analytics.latestSync)
    : "Not available";
  const metrics = [
    { label: "Average listed price", value: analytics.averagePrice ? `PKR ${money.format(analytics.averagePrice)}` : "Not available", icon: FiCreditCard, iconStyle: "bg-[#eeedff] text-[#625bff]" },
    { label: "Live price listings", value: analytics.activeListings.toLocaleString(), icon: FiTag, iconStyle: "bg-[#e8fbf1] text-[#13a66b]" },
    { label: "Average review rating", value: analytics.averageRating ? `${analytics.averageRating.toFixed(1)} ★` : "Not available", icon: FiStar, iconStyle: "bg-[#fff6e4] text-[#f1a516]" },
    { label: "Published reviews", value: analytics.reviewsTotal.toLocaleString(), icon: FiMessageCircle, iconStyle: "bg-[#eaf3ff] text-[#3785f6]" },
  ];

  return (
    <section className="my-12 bg-transparent p-0">
      <div className="mb-5 flex flex-col gap-2 px-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#6271d8]">Live market intelligence</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-[#17213a]">Availability analytics</h2>
        </div>
        <p className="text-xs text-[#8290a9]">Last catalog sync: {updatedLabel}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon, iconStyle }) => (
          <article key={label} className="rounded-[10px] border border-[#e8ebf3] bg-white p-4 shadow-[0_4px_12px_rgba(57,72,110,0.05)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-1 text-xs font-semibold text-[#7a879f]">{label}<FiInfo className="text-[#aeb8c9]" /></p>
                <p className="mt-2 text-2xl font-bold tracking-[-0.04em] text-[#17213a]">{value}</p>
                <p className="mt-2 text-xs text-[#8a96a9]">Calculated from current source records</p>
              </div>
              <span className={`flex h-11 w-11 items-center justify-center rounded-[10px] ${iconStyle}`}><Icon className="h-5 w-5" /></span>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <article className="rounded-[10px] border border-[#e8ebf3] bg-white p-5 shadow-[0_4px_12px_rgba(57,72,110,0.05)]">
          <h3 className="text-base font-bold text-[#17213a]">Price comparison</h3>
          <p className="mt-1 text-xs text-[#8491a7]">Average of live prices currently saved by each marketplace</p>
          <div className="mt-6 space-y-5">
            {analytics.storeAverages.map((store, index) => (
              <div key={store.name} className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                <span className={`flex h-8 w-8 items-center justify-center rounded-[10px] text-xs font-bold text-white ${index === 0 ? "bg-[#5453ec]" : "bg-[#0b7183]"}`}>{store.name.charAt(0)}</span>
                <div>
                  <div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold text-[#26324a]">{store.name}</p><p className="text-sm font-bold text-[#26324a]">PKR {money.format(store.average)}</p></div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-[10px] bg-[#edf0f7]"><div className={index === 0 ? "h-full rounded-[10px] bg-[#3e5bf3]" : "h-full rounded-[10px] bg-[#9aa8c3]"} style={{ width: `${(store.average / Math.max(...analytics.storeAverages.map((item) => item.average))) * 100}%` }} /></div>
                </div>
                <span className={`rounded-[10px] px-2 py-1 text-[10px] font-bold ${index === 0 ? "bg-[#e8fbf1] text-[#1aa56e]" : "text-transparent"}`}>{index === 0 ? "LOWEST" : "—"}</span>
              </div>
            ))}
          </div>
          {bestStore && saving !== null && (
            <div className="mt-6 flex items-center justify-between gap-3 rounded-[10px] border border-[#dce8ff] bg-[#f3f7ff] p-3">
              <div><p className="text-sm font-bold text-[#26324a]">{bestStore.name} currently has the lowest average</p><p className="text-xs text-[#8190aa]">Difference against {nextStore.name}: PKR {money.format(saving)}</p></div>
              <span className="rounded-[10px] bg-[#e0f8ec] px-2 py-1 text-xs font-bold text-[#17a36a]">PKR {money.format(saving)}</span>
            </div>
          )}
        </article>

        <article className="rounded-[10px] border border-[#e8ebf3] bg-white p-5 shadow-[0_4px_12px_rgba(57,72,110,0.05)]">
          <h3 className="text-base font-bold text-[#17213a]">Customer sentiment</h3>
          <p className="mt-1 text-xs text-[#8491a7]">Only public ratings and review counts saved in the catalog</p>
          <div className="mt-4 divide-y divide-[#edf0f5]">
            {analytics.feedback.length ? analytics.feedback.map((platform) => (
              <div key={platform.name} className="grid grid-cols-[1.1fr_1fr_auto_auto] items-center gap-3 py-3 text-xs">
                <div className="flex items-center gap-2"><span className={`flex h-6 w-6 items-center justify-center rounded-[7px] text-[10px] font-bold text-white ${platformColors[platform.name] || "bg-[#6b7280]"}`}>{platform.name.charAt(0)}</span><span className="font-semibold text-[#35415a]">{platform.name}</span></div>
                <span className="text-sm tracking-[0.12em] text-[#f5a623]">★★★★★</span>
                <span className="font-bold text-[#35415a]">{platform.rating.toFixed(1)}</span>
                <span className="whitespace-nowrap text-[#8491a7]">{platform.reviews} reviews</span>
              </div>
            )) : <p className="py-6 text-sm text-[#8491a7]">No public ratings are available from the synced sources yet.</p>}
          </div>
        </article>
      </div>

      <article className="mt-4 rounded-[10px] border border-[#e8ebf3] bg-white p-5 shadow-[0_4px_12px_rgba(57,72,110,0.05)]">
        <div><h3 className="text-base font-bold text-[#17213a]">Recently synchronized devices</h3><p className="mt-1 text-xs text-[#8491a7]">Current listing prices only — no sales estimate is shown.</p></div>
        <div className="mt-5 overflow-x-auto"><div className="min-w-[720px]"><div className="grid grid-cols-[1.3fr_1fr_1fr_0.45fr] gap-5 border-b border-[#edf0f5] pb-2 text-[10px] font-bold uppercase tracking-wide text-[#8491a7]"><span>Device</span><span>{comparisonSources[0]?.name || "Source 1"} price</span><span>{comparisonSources[1]?.name || "Source 2"} price</span><span>Reviews</span></div>
          {analytics.topPhones.map((phone) => (
            <div key={phone.id} className="grid grid-cols-[1.3fr_1fr_1fr_0.45fr] items-center gap-5 border-b border-[#edf0f5] py-3 last:border-0">
              <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-[7px] bg-[#f2f4f8] p-1">{phone.image ? <img src={phone.image} alt="" className="h-full w-full object-contain" /> : <FiBarChart2 className="text-[#6271d8]" />}</div><span className="text-sm font-bold text-[#35415a]">{phone.name}</span></div>
              {comparisonSources.map((store, index) => { const price = phone.prices[store.name]; return <div key={store.name}><p className="text-xs font-semibold text-[#63708a]">{price ? `PKR ${money.format(price)}` : "Not listed"}</p><div className="mt-2 h-1.5 overflow-hidden rounded-[10px] bg-[#edf0f7]">{price ? <div className={`h-full rounded-[10px] ${index === 0 ? "bg-[#3863f6]" : "bg-[#13b879]"}`} style={{ width: `${(price / maxPhonePrice) * 100}%` }} /> : null}</div></div>; })}
              {comparisonSources.length < 2 && <div><p className="text-xs font-semibold text-[#63708a]">Not available</p></div>}
              <span className="text-sm font-bold text-[#35415a]">{phone.reviews}</span>
            </div>
          ))}
        </div></div>
      </article>
    </section>
  );
};

export default PlatformInsights;
