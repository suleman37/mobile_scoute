import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Iphone from "./Pages/Iphone";
import Android from "./Pages/Android";
import Avalibility from "./Pages/Avalibility";
import Product from "./Pages/Product";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Searchbar from "./components/Searchbar";

const App = () => {
  return (
    <>
      <div className="px-4 sm:px-7 md:px-[5vw] lg:px-[7vw]">
        <Navbar />
        <Searchbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/iphone" element={<Iphone />} />
          <Route path="/android" element={<Android />} />
          <Route path="/avalibility" element={<Avalibility />} />
          <Route path="/product/:id" element={<Product />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
};

export default App;
