import React from "react";
import { Link } from "react-router-dom";
import iphoneVisual from "../assets/frontend_assets/hero-iphone-real.jpg";
import androidVisual from "../assets/frontend_assets/hero-android-real.jpg";

const Hero = () => {
  return (
    <>
      <div className="mt-5 flex flex-col overflow-hidden border border-gray-400 sm:flex-row">
        <div className="flex w-full items-center justify-center px-6 py-14 sm:w-1/2 sm:px-10 sm:py-0">
          <div className="text-[#414141]">
            <div className="flex items-center gap-2">
              <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
              <p className="font-medium text-sm sm:text-base">
                PHONE CATALOG
              </p>
            </div>
            <h1 className="prata-regular text-3xl leading-relaxed sm:py-3 lg:text-5xl">
              MobileScout is the platform for comparing and exploring the mobilephones from different online stores in Pakistan</h1>
            <div className="mt-6 flex flex-col items-start gap-4">
              <Link
                to="/iphone"
                className="flex items-center gap-2 text-sm font-semibold sm:text-base"
              >
                EXPLORE IPHONE
                <span className="h-[2px] w-8 bg-[#414141] md:w-11"></span>
              </Link>
              <Link
                to="/android"
                className="flex items-center gap-2 text-sm font-semibold sm:text-base"
              >
                EXPLORE ANDROID
                <span className="h-[2px] w-8 bg-[#414141] md:w-11"></span>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-center bg-black px-4 py-10 sm:w-1/2 sm:px-6 sm:py-12">
          <div className="relative flex h-full w-full max-w-[580px] items-center justify-center">
            <div className="absolute left-2 top-10 w-[44%] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#101010] shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
              <img
                className="h-[400px] w-full object-cover"
                src={iphoneVisual}
                alt="iPhone hero visual"
              />
            </div>
            <div className="relative ml-auto w-[58%] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#101010] shadow-[0_18px_40px_rgba(0,0,0,0.55)]">
              <img
                className="h-[500px] w-full object-cover"
                src={androidVisual}
                alt="Android hero visual"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
