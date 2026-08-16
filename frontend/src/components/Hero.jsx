import React from "react";
import { Link } from "react-router-dom";
import iphoneVisual from "../assets/frontend_assets/hero-iphone-real.jpg";
import androidVisual from "../assets/frontend_assets/hero-android-real.jpg";

const Hero = () => {
  return (
    <section className="relative my-8 overflow-hidden rounded-[10px] bg-[#0b0b0d] px-6 py-10 text-white shadow-[0_30px_80px_rgba(20,20,25,0.18)] sm:px-10 sm:py-16 lg:px-16 lg:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_16%,rgba(80,97,255,0.48),transparent_23rem),radial-gradient(circle_at_88%_82%,rgba(209,181,255,0.25),transparent_22rem)]" />
      <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-2xl">
          <p className="inline-flex rounded-[10px] border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/75">
            Pakistan's smarter mobile catalog
          </p>
          <h1 className="mt-6 max-w-xl text-4xl font-semibold tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl lg:leading-[1.02]">
            Find the phone that fits your life.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-white/65 sm:text-lg">
            Compare trusted store prices, detailed device information, real video reviews and customer feedback—all in one focused place.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/iphone"
                className="rounded-[10px] bg-white px-5 py-3 text-sm font-semibold text-[#1d1d1f] transition hover:scale-[1.02] hover:bg-white/90"
              >
                Explore iPhone
              </Link>
              <Link
                to="/android"
                className="rounded-[10px] border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Explore Android
              </Link>
          </div>
        </div>
        <div className="relative mx-auto h-[360px] w-full max-w-xl sm:h-[420px]">
          <div className="absolute left-[3%] top-12 w-[45%] rotate-[-8deg] overflow-hidden rounded-[10px] border border-white/15 bg-[#17171b] p-2 shadow-[0_24px_48px_rgba(0,0,0,0.38)]">
              <img
                className="h-[265px] w-full rounded-[10px] object-cover sm:h-[315px]"
                src={iphoneVisual}
                alt="iPhone hero visual"
              />
          </div>
          <div className="absolute bottom-0 right-[3%] w-[56%] rotate-[6deg] overflow-hidden rounded-[10px] border border-white/20 bg-[#17171b] p-2 shadow-[0_30px_55px_rgba(0,0,0,0.5)]">
              <img
                className="h-[305px] w-full rounded-[10px] object-cover sm:h-[355px]"
                src={androidVisual}
                alt="Android hero visual"
              />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
