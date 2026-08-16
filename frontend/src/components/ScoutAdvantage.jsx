import React from "react";
import {
  FiBarChart2,
  FiMessageCircle,
  FiMic,
  FiPlayCircle,
  FiRefreshCw,
  FiSearch,
} from "react-icons/fi";

const benefits = [
  {
    icon: FiSearch,
    content: <>Find the right phone with <span className="text-[#0071e3]">one focused search.</span></>,
  },
  {
    icon: FiMic,
    content: <>Use <span className="text-[#a855f7]">voice search</span> to explore mobiles naturally.</>,
  },
  {
    icon: FiPlayCircle,
    content: <>Watch a <span className="text-[#ef4444]">model-specific video review</span> before deciding.</>,
  },
  {
    icon: FiMessageCircle,
    content: <>See customer feedback across <span className="text-[#f59e0b]">multiple platforms.</span></>,
  },
  {
    icon: FiBarChart2,
    content: <>Compare prices and <span className="text-[#16a34a]">market signals</span> at a glance.</>,
  },
  {
    icon: FiRefreshCw,
    content: <>Stay current with <span className="text-[#6366f1]">fresh availability</span> updates.</>,
  },
];

const ScoutAdvantage = () => {
  return (
    <section className="my-20">
      <h2 className="text-3xl font-semibold tracking-[-0.05em] text-[#1d1d1f] sm:text-4xl">
        The MobileScout advantage. <span className="text-[#6e6e73]">Everything you need to choose with confidence.</span>
      </h2>
      <div className="mt-7 grid gap-5 lg:grid-cols-4">
        <article className="relative min-h-[440px] overflow-hidden rounded-[1.75rem] bg-[#111318] p-7 text-white shadow-[0_18px_36px_rgba(17,24,39,0.16)] lg:row-span-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8ab4ff]">Smarter mobile shopping</p>
          <h3 className="mt-3 max-w-xs text-3xl font-semibold leading-[1.08] tracking-[-0.045em]">
            See the full picture before you buy.
          </h3>
          <p className="mt-4 max-w-xs text-sm leading-6 text-white/60">
            MobileScout brings price comparison, device details, reviews and availability into one simple workspace.
          </p>
          <div className="absolute bottom-7 left-7 right-7 rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur">
            <div className="flex items-end gap-2">
              <span className="h-20 flex-1 rounded-t-lg bg-gradient-to-t from-[#2f6bff] to-[#8ab4ff]" />
              <span className="h-32 flex-1 rounded-t-lg bg-gradient-to-t from-[#8b5cf6] to-[#c4b5fd]" />
              <span className="h-24 flex-1 rounded-t-lg bg-gradient-to-t from-[#f59e0b] to-[#fcd34d]" />
              <span className="h-36 flex-1 rounded-t-lg bg-gradient-to-t from-[#10b981] to-[#6ee7b7]" />
            </div>
            <p className="mt-4 text-xs font-medium text-white/70">Compare signals. Find your fit.</p>
          </div>
        </article>

        <div className="grid gap-5 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-3">
          {benefits.map(({ icon: Icon, content }, index) => (
            <article
              key={index}
              className="min-h-[205px] rounded-[1.75rem] bg-white p-7 shadow-[0_10px_22px_rgba(17,17,17,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_32px_rgba(17,17,17,0.1)]"
            >
              <Icon className="h-8 w-8 text-[#1d1d1f]" strokeWidth={1.7} />
              <p className="mt-5 text-xl font-semibold leading-[1.2] tracking-[-0.035em] text-[#1d1d1f]">{content}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScoutAdvantage;
