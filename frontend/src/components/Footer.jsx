import React from "react";

const Footer = () => {
  return (
    <>
      <footer className="mt-24 rounded-t-[2rem] bg-[#1d1d1f] px-6 text-white sm:px-10">
        <div className="grid grid-cols-1 gap-12 py-14 text-sm text-white/60 sm:grid-cols-[1.5fr_0.8fr_0.8fr] sm:gap-20">
          <div className="max-w-xl">
            <p className="mb-6 text-lg font-bold tracking-[-0.03em] text-white">
            MobileScout
            </p>
            <p className="leading-7">
              MobileScout is presenting the Pakistan iPhone API as a structured
              catalog. The site focuses on browsing, reference details, sync
              metadata, and store snapshots rather than cart or checkout flows.
            </p>
          </div>
          <div>
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.12em] text-white">Explore</p>
            <ul className="space-y-2">
              <li>Home</li>
              <li>Availability</li>
              <li>Pakistan iPhones</li>
              <li>Catalog Reference</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div>
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.12em] text-white">Contact</p>
            <ul className="space-y-2">
              <li>+92-300-555-0199</li>
              <li>hello@mobilescout.com</li>
            </ul>
          </div>
        </div>
      </footer>
      <div className="border-t border-white/10 bg-[#1d1d1f] px-6">
        <p className="py-5 text-center text-sm text-white/45">
          Copyright 2026 MobileScout. All rights reserved.
        </p>
      </div>
    </>
  );
};

export default Footer;
