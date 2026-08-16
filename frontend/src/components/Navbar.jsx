import React, { useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import search from "../assets/frontend_assets/search_icon.png";
import { Link, NavLink } from "react-router-dom";
import dropdown from "../assets/frontend_assets/dropdown_icon.png";
import Menu from "../assets/frontend_assets/menu_icon.png";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { setShowSearch, currentLocation } = useContext(ShopContext);

  return (
    <React.Fragment>
      <div className="flex items-center justify-between py-5 font-medium">
        <Link to="/">
          <span className="text-lg font-bold uppercase tracking-[0.18em] text-gray-700">
            MOBILESCOUT
          </span>
        </Link>
        <ul className="sm:flex gap-5 text-sm text-gray-700 hidden">
          <NavLink to="/" className="flex flex-col items-center gap-1">
            <p>HOME</p>
            <hr className="w-2/3 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
          <NavLink
            to="/iphone"
            className="flex flex-col items-center gap-1"
          >
            <p>IPHONE</p>
            <hr className="w-2/3 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
          <NavLink
            to="/android"
            className="flex flex-col items-center gap-1"
          >
            <p>ANDROID</p>
            <hr className="w-2/3 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
          <NavLink
            to="/avalibility"
            className="flex flex-col items-center gap-1"
          >
            <p>AVAILABILITY</p>
            <hr className="w-2/3 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
        </ul>
        <div className="flex items-center gap-6">
          <div className="hidden rounded-full border border-gray-200 px-3 py-1 text-[11px] font-normal text-gray-500 md:block">
            {currentLocation}
          </div>
          <img
            src={search}
            className="w-5 cursor-pointer"
            alt="search_icon"
            onClick={() => setShowSearch(true)}
          />
          <img
            onClick={() => setVisible(!visible)}
            src={Menu}
            className="w-5 cursor-pointer sm:hidden"
            alt="menu"
          />
        </div>
        <div
          className={`absolute top-0 left-0 bottom-0 overflow-hidden bg-white z-10 transition-all ${
            visible ? "w-full" : "w-0"
          }`}
        >
          <div className="flex flex-col text-gray-500">
            <div className="flex items-center gap-4 p-3">
              <img
                onClick={() => setVisible(!visible)}
                src={dropdown}
                className="h-4 rotate-180 cursor-pointer"
                alt="dropdown"
              />
              <p>Back</p>
            </div>
            <div className="border px-6 py-3 text-xs text-gray-500">
              {currentLocation}
            </div>
            <NavLink
              className="py-2 pl-6 border"
              onClick={() => setVisible(!visible)}
              to="/"
            >
              HOME
            </NavLink>
            <NavLink
              className="py-2 pl-6 border"
              onClick={() => setVisible(!visible)}
              to="/iphone"
            >
              IPHONE
            </NavLink>
            <NavLink
              className="py-2 pl-6 border"
              onClick={() => setVisible(!visible)}
              to="/android"
            >
              ANDROID
            </NavLink>
            <NavLink
              className="py-2 pl-6 border"
              onClick={() => setVisible(!visible)}
              to="/avalibility"
            >
              AVAILABILITY
            </NavLink>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Navbar;
