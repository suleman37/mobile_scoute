import React, { useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link, NavLink } from "react-router-dom";
import Menu from "../assets/frontend_assets/menu_icon.png";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { setShowSearch, currentLocation } = useContext(ShopContext);

  return (
    <React.Fragment>
      <header className="sticky top-0 z-[110] -mx-4 border-b border-black/[0.06] bg-[#f5f5f7]/80 px-4 backdrop-blur-xl sm:-mx-7 sm:px-7 md:-mx-[5vw] md:px-[5vw] lg:-mx-[7vw] lg:px-[7vw]">
        <div className="flex h-[72px] items-center justify-between gap-5">
          <Link to="/" className="flex items-center gap-3" aria-label="MobileScout home">
            <span className="flex h-8 w-8 items-center justify-center rounded-[11px] bg-[#1d1d1f] text-sm font-bold text-white shadow-lg shadow-black/10">M</span>
            <span className="text-[15px] font-bold tracking-[-0.03em] text-[#1d1d1f] sm:text-base">MobileScout</span>
          </Link>

        <ul className="hidden items-center gap-1 rounded-full border border-black/[0.07] bg-white/75 p-1 text-[13px] font-medium text-[#424245] shadow-sm lg:flex">
          <NavLink to="/" className="rounded-full px-4 py-2 transition hover:bg-[#f5f5f7]">Discover</NavLink>
          <NavLink to="/iphone" className="rounded-full px-4 py-2 transition hover:bg-[#f5f5f7]">iPhone</NavLink>
          <NavLink to="/android" className="rounded-full px-4 py-2 transition hover:bg-[#f5f5f7]">Android</NavLink>
          <NavLink to="/avalibility" className="rounded-full px-4 py-2 transition hover:bg-[#f5f5f7]">Availability</NavLink>
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden max-w-48 truncate rounded-full border border-black/[0.07] bg-white px-3 py-2 text-[11px] font-medium text-[#6e6e73] md:block">
            {currentLocation}
          </div>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.08] bg-white text-[#1d1d1f] transition hover:scale-105 hover:bg-[#1d1d1f] hover:text-white"
            aria-label="Search catalog"
            onClick={() => setShowSearch(true)}
          >
            <svg aria-hidden="true" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="6" />
              <path d="m20 20-4.35-4.35" />
            </svg>
          </button>
          <img
            onClick={() => setVisible(!visible)}
            src={Menu}
            className="w-5 cursor-pointer sm:hidden"
            alt="menu"
          />
        </div>
        </div>
        <div
          className={`absolute left-0 right-0 top-[72px] overflow-hidden border-b border-black/[0.07] bg-white shadow-xl transition-all sm:hidden ${
            visible ? "max-h-96 py-3" : "max-h-0 py-0"
          }`}
        >
          <div className="flex flex-col px-4 text-sm font-medium text-[#424245]">
            <div className="mb-2 rounded-xl bg-[#f5f5f7] px-4 py-3 text-xs text-[#6e6e73]">{currentLocation}</div>
            <NavLink className="rounded-xl px-4 py-3 hover:bg-[#f5f5f7]" onClick={() => setVisible(false)} to="/">Discover</NavLink>
            <NavLink className="rounded-xl px-4 py-3 hover:bg-[#f5f5f7]" onClick={() => setVisible(false)} to="/iphone">iPhone</NavLink>
            <NavLink className="rounded-xl px-4 py-3 hover:bg-[#f5f5f7]" onClick={() => setVisible(false)} to="/android">Android</NavLink>
            <NavLink className="rounded-xl px-4 py-3 hover:bg-[#f5f5f7]" onClick={() => setVisible(false)} to="/avalibility">Availability</NavLink>
          </div>
        </div>
      </header>
    </React.Fragment>
  );
};

export default Navbar;
