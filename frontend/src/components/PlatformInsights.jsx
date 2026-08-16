import React, { useContext, useMemo } from "react";
import {
  FiArrowRight,
  FiBarChart2,
  FiCreditCard,
  FiInfo,
  FiShoppingCart,
  FiStar,
  FiTag,
  FiTrendingDown,
  FiTrendingUp,
} from "react-icons/fi";
import { ShopContext } from "../context/ShopContext";

const money = new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 });

const Sparkline = ({ color = "#5b5cf0", reverse = false }) => (
  <svg aria-hidden="true" className="h-8 w-full" viewBox="0 0 180 32" fill="none" preserveAspectRatio="none">
    <path
      d={reverse ? "M2 10 16 15 28 12 42 18 57 23 70 17 85 25 100 20 115 16 129 21 144 10 160 14 178 8" : "M2 24 16 16 28 20 42 18 57 21 70 15 85 22 100 17 115 14 129 19 144 9 160 13 178 6"}
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const platformColors = {
  Daraz: "bg-[#f15a24]",
  "Google Reviews": "bg-[#4285f4]",
  Facebook: "bg-[#1877f2]",
  Instagram: "bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]",
  PriceOye: "bg-[#4f46e5]",
};

const PlatformInsights = () => {
  const { products, productsLoading } = useContext(ShopContext);

  const analytics = useMemo(() => {
    const stores = new Map();
    const platforms = new Map();
    let reviewsTotal = 0;
    let ratingTotal = 0;

    products.forEach((product) => {
      (product.stores || []).forEach((store) => {
        if (!store.storeName || typeof store.price !== "number") return;
        const entry = stores.get(store.storeName) || { total: 0, count: 0 };
        entry.total += store.price;
        entry.count += 1;
        stores.set(store.storeName, entry);
      });

      (product.customerReviews || []).forEach((review) => {
        if (!review.platform || typeof review.rating !== "number") return;
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
      .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    const topPhones = products
      .map((product) => ({
        id: product._id,
        name: product.name,
        image: product.image?.[0],
        sales: product.salesCount || 0,
        prices: (product.stores || []).reduce((result, store) => {
          if (store.storeName && typeof store.price === "number") result[store.storeName] = store.price;
          return result;
        }, {}),
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 3);

    const totalSales = topPhones.reduce((sum, phone) => sum + phone.sales, 0);
    const averagePrice = storeAverages.length
      ? Math.round(storeAverages.reduce((sum, store) => sum + store.average, 0) / storeAverages.length)
      : 0;

    return {
      storeAverages,
      feedback,
      topPhones,
      totalSales,
      averagePrice,
      averageRating: reviewsTotal ? ratingTotal / reviewsTotal : 0,
      activeListings: storeAverages.reduce((sum, store) => sum + store.listings, 0),
    };
  }, [products]);

  if (productsLoading || !products.length) return null;

  const [bestStore, nextStore] = analytics.storeAverages;
  const saving = bestStore && nextStore ? Math.max(nextStore.average - bestStore.average, 0) : 0;
  const maxPhonePrice = Math.max(
    ...analytics.topPhones.flatMap((phone) => Object.values(phone.prices)),
    1
  );
  const metrics = [
    { label: "Average market price", value: `PKR ${money.format(analytics.averagePrice)}`, trend: "4.2%", tone: "text-rose-500", icon: FiCreditCard, iconStyle: "bg-[#eeedff] text-[#625bff]", line: "#766df4", reverse: true },
    { label: "Total active listings", value: analytics.activeListings.toLocaleString(), trend: "12.5%", tone: "text-emerald-500", icon: FiTag, iconStyle: "bg-[#e8fbf1] text-[#13a66b]", line: "#41c88c" },
    { label: "Average rating", value: `${analytics.averageRating.toFixed(1)} ★`, trend: "0.3", tone: "text-emerald-500", icon: FiStar, iconStyle: "bg-[#fff6e4] text-[#f1a516]", line: "#ffb62d" },
    { label: "Estimated sales", value: analytics.totalSales.toLocaleString(), trend: "8.7%", tone: "text-emerald-500", icon: FiShoppingCart, iconStyle: "bg-[#eaf3ff] text-[#3785f6]", line: "#5795ff" },
  ];

  return (
    <section className="my-12 bg-transparent p-0">
      <div className="mb-5 flex flex-col gap-2 px-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#6271d8]">Market intelligence</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-[#17213a]">Availability analytics</h2>
        </div>
        <p className="text-xs text-[#8290a9]">Updated from the MobileScout catalog</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, trend, tone, icon: Icon, iconStyle, line, reverse }) => (
          <article key={label} className="rounded-[10px] border border-[#e8ebf3] bg-white p-4 shadow-[0_4px_12px_rgba(57,72,110,0.05)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-1 text-xs font-semibold text-[#7a879f]">{label}<FiInfo className="text-[#aeb8c9]" /></p>
                <p className="mt-2 text-2xl font-bold tracking-[-0.04em] text-[#17213a]">{value}</p>
                <p className={`mt-2 flex items-center gap-1 text-xs font-semibold ${tone}`}>
                  {tone.includes("rose") ? <FiTrendingDown /> : <FiTrendingUp />} {trend} <span className="font-normal text-[#8a96a9]">vs last 30 days</span>
                </p>
              </div>
              <span className={`flex h-11 w-11 items-center justify-center rounded-[10px] ${iconStyle}`}><Icon className="h-5 w-5" /></span>
            </div>
            <div className="mt-5"><Sparkline color={line} reverse={reverse} /></div>
          </article>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <article className="rounded-[10px] border border-[#e8ebf3] bg-white p-5 shadow-[0_4px_12px_rgba(57,72,110,0.05)]">
          <h3 className="text-base font-bold text-[#17213a]">Price comparison</h3>
          <p className="mt-1 text-xs text-[#8491a7]">Average listed prices across marketplaces</p>
          <div className="mt-6 space-y-5">
            {analytics.storeAverages.map((store, index) => (
              <div key={store.name} className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                <span className={`flex h-8 w-8 items-center justify-center rounded-[10px] text-xs font-bold text-white ${index === 0 ? "bg-[#5453ec]" : "bg-[#0b7183]"}`}>{store.name.charAt(0)}</span>
                <div>
                  <div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold text-[#26324a]">{store.name}</p><p className="text-sm font-bold text-[#26324a]">PKR {money.format(store.average)}</p></div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-[10px] bg-[#edf0f7]"><div className={index === 0 ? "h-full rounded-[10px] bg-[#3e5bf3]" : "h-full rounded-[10px] bg-[#9aa8c3]"} style={{ width: `${(store.average / Math.max(...analytics.storeAverages.map((item) => item.average))) * 100}%` }} /></div>
                </div>
                <span className={`rounded-[10px] px-2 py-1 text-[10px] font-bold ${index === 0 ? "bg-[#e8fbf1] text-[#1aa56e]" : "text-transparent"}`}>{index === 0 ? "BEST" : "—"}</span>
              </div>
            ))}
          </div>
          {bestStore && (
            <div className="mt-6 flex items-center justify-between gap-3 rounded-[10px] border border-[#dce8ff] bg-[#f3f7ff] p-3">
              <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#3e5bf3] text-white"><FiTrendingDown /></span><div><p className="text-sm font-bold text-[#26324a]">{bestStore.name} is cheaper</p><p className="text-xs text-[#8190aa]">Average price is PKR {money.format(saving)} lower</p></div></div>
              <span className="rounded-[10px] bg-[#e0f8ec] px-2 py-1 text-xs font-bold text-[#17a36a]">PKR {money.format(saving)}</span>
            </div>
          )}
        </article>

        <article className="rounded-[10px] border border-[#e8ebf3] bg-white p-5 shadow-[0_4px_12px_rgba(57,72,110,0.05)]">
          <div className="flex items-center justify-between gap-3"><div><h3 className="text-base font-bold text-[#17213a]">Customer sentiment</h3><p className="mt-1 text-xs text-[#8491a7]">Based on average ratings from reviews across platforms</p></div><span className="flex items-center gap-1 text-xs font-semibold text-[#3e5bf3]">View all reviews <FiArrowRight /></span></div>
          <div className="mt-4 divide-y divide-[#edf0f5]">
            {analytics.feedback.map((platform) => (
              <div key={platform.name} className="grid grid-cols-[1.1fr_1fr_auto_auto] items-center gap-3 py-3 text-xs">
                <div className="flex items-center gap-2"><span className={`flex h-6 w-6 items-center justify-center rounded-[7px] text-[10px] font-bold text-white ${platformColors[platform.name] || "bg-[#6b7280]"}`}>{platform.name.charAt(0)}</span><span className="font-semibold text-[#35415a]">{platform.name}</span></div>
                <span className="text-sm tracking-[0.12em] text-[#f5a623]">★★★★★</span>
                <span className="font-bold text-[#35415a]">{platform.rating.toFixed(1)}</span>
                <span className="whitespace-nowrap text-[#8491a7]">{platform.reviews} reviews</span>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className="mt-4 rounded-[10px] border border-[#e8ebf3] bg-white p-5 shadow-[0_4px_12px_rgba(57,72,110,0.05)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="text-base font-bold text-[#17213a]">Top performing devices</h3><p className="mt-1 text-xs text-[#8491a7]">Price comparison and estimated sales for top devices</p></div><div className="flex items-center gap-4 text-xs"><span className="flex items-center gap-1.5 text-[#71809a]"><i className="h-2.5 w-2.5 rounded-[10px] bg-[#3863f6]" />PriceOye</span><span className="flex items-center gap-1.5 text-[#71809a]"><i className="h-2.5 w-2.5 rounded-[10px] bg-[#13b879]" />Telemart</span><span className="font-semibold text-[#3e5bf3]">View full report <FiArrowRight className="inline" /></span></div></div>
        <div className="mt-5 overflow-x-auto"><div className="min-w-[720px]"><div className="grid grid-cols-[1.3fr_1fr_1fr_0.8fr] gap-5 border-b border-[#edf0f5] pb-2 text-[10px] font-bold uppercase tracking-wide text-[#8491a7]"><span>Device</span><span>PriceOye price</span><span>Telemart price</span><span>Estimated sales</span></div>
          {analytics.topPhones.map((phone) => (
            <div key={phone.id} className="grid grid-cols-[1.3fr_1fr_1fr_0.8fr] items-center gap-5 border-b border-[#edf0f5] py-3 last:border-0">
              <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-[7px] bg-[#f2f4f8] p-1">{phone.image ? <img src={phone.image} alt="" className="h-full w-full object-contain" /> : <FiBarChart2 className="text-[#6271d8]" />}</div><span className="text-sm font-bold text-[#35415a]">{phone.name}</span></div>
              {[{ name: "PriceOye", color: "bg-[#3863f6]" }, { name: "Telemart", color: "bg-[#13b879]" }].map((store) => { const price = phone.prices[store.name] || 0; return <div key={store.name}><p className="text-xs font-semibold text-[#63708a]">PKR {money.format(price)}</p><div className="mt-2 h-1.5 overflow-hidden rounded-[10px] bg-[#edf0f7]"><div className={`h-full rounded-[10px] ${store.color}`} style={{ width: `${(price / maxPhonePrice) * 100}%` }} /></div></div>; })}
              <div className="flex items-center justify-between gap-2"><span className="text-sm font-bold text-[#35415a]">{phone.sales.toLocaleString()} sales</span><span className="rounded-[10px] bg-[#e8fbf1] px-2 py-1 text-[10px] font-bold text-[#19a66d]">↑ 8.7%</span></div>
            </div>
          ))}
        </div></div>
      </article>
    </section>
  );
};

export default PlatformInsights;
