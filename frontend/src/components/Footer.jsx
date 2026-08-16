import React from "react";

const Footer = () => {
  return (
    <>
      <footer className="mt-24">
        <div className="grid grid-cols-1 gap-14 py-12 text-sm text-gray-600 sm:grid-cols-[1.5fr_0.8fr_0.8fr] sm:gap-20">
          <div className="max-w-xl">
            <p className="mb-6 text-lg font-bold uppercase tracking-[0.18em] text-gray-800">
            MOBILESCOUT
            </p>
            <p className="leading-7">
              MobileScout is presenting the Pakistan iPhone API as a structured
              catalog. The site focuses on browsing, reference details, sync
              metadata, and store snapshots rather than cart or checkout flows.
            </p>
          </div>
          <div>
            <p className="mb-5 text-2xl font-semibold text-gray-900">COMPANY</p>
            <ul className="space-y-2">
              <li>Home</li>
              <li>Availability</li>
              <li>Pakistan iPhones</li>
              <li>Catalog Reference</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div>
            <p className="mb-5 text-2xl font-semibold text-gray-900">GET IN TOUCH</p>
            <ul className="space-y-2">
              <li>+92-300-555-0199</li>
              <li>hello@mobilescout.com</li>
            </ul>
          </div>
        </div>
      </footer>
      <div className="border-t border-gray-200">
        <p className="py-5 text-center text-sm text-gray-700">
          Copyright 2026 MobileScout. All rights reserved.
        </p>
      </div>
    </>
  );
};

export default Footer;
