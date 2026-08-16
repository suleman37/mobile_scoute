import React from "react";

const HandleSubmit = (event) => {
  event.preventDefault();
};

const NewsLetter = () => {
  return (
    <section className="mx-auto max-w-4xl py-12 text-center sm:py-16">
      <p className="text-3xl font-semibold text-gray-900">Stay Updated</p>
      <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-gray-400">
        Subscribe for API sync updates, new catalog sections, and future
        MobileScout device pages.
      </p>
      <form
        onSubmit={HandleSubmit}
        className="mx-auto mt-8 flex w-full max-w-3xl overflow-hidden border border-gray-200 bg-white"
      >
        <input
          type="email"
          placeholder="Enter your email"
          className="min-w-0 flex-1 px-5 py-4 text-base text-gray-700 outline-none"
        />
        <button
          className="bg-black px-10 py-4 text-base font-medium text-white transition hover:bg-gray-900"
          type="submit"
        >
          Join
        </button>
      </form>
    </section>
  );
};

export default NewsLetter;
