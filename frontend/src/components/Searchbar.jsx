import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import searchicon from "../assets/frontend_assets/search_icon.png";
import crossicon from "../assets/frontend_assets/cross_icon.png";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";

const Searchbar = () => {
  const { search, setSearch, showsearch, setShowSearch, products } =
    useContext(ShopContext);
  const [isVisible, setIsVisible] = useState(true);
  const [searchMessage, setSearchMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  const matchedProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return [];
    }

    return [...products]
      .filter((product) => product.searchIndex.includes(query))
      .sort((a, b) => {
        const aStarts = a.name.toLowerCase().startsWith(query) ? 1 : 0;
        const bStarts = b.name.toLowerCase().startsWith(query) ? 1 : 0;

        if (bStarts !== aStarts) {
          return bStarts - aStarts;
        }

        return a.name.length - b.name.length;
      })
      .slice(0, 6);
  }, [products, search]);

  const handleInputChange = (event) => {
    setSearch(event.target.value);
    setSearchMessage("");
  };

  const handleCloseClick = () => {
    recognitionRef.current?.abort();
    setSearch("");
    setShowSearch(false);
    setSearchMessage("");
  };

  const startVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSearchMessage("Voice search is supported in Chrome and other compatible browsers.");
      return;
    }

    recognitionRef.current?.abort();

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setSearchMessage("Listening… say a mobile name or brand.");
    };
    recognition.onresult = (event) => {
      setSearch(event.results[0][0].transcript);
      setSearchMessage("");
    };
    recognition.onerror = (event) => {
      const message =
        event.error === "not-allowed"
          ? "Please allow microphone access to use voice search."
          : "Voice search could not hear a query. Please try again.";
      setSearchMessage(message);
    };
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const openProduct = (product) => {
    setSearch(product.name);
    setShowSearch(false);
    setSearchMessage("");
    navigate(`/product/${product._id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!matchedProducts.length) {
      setSearchMessage(
        search.trim()
          ? "No matching product was found for this search."
          : "Type a product name to search the catalog."
      );
      return;
    }

    openProduct(matchedProducts[0]);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY < window.innerHeight / 3);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(
    () => () => {
      recognitionRef.current?.abort();
    },
    []
  );

  return (
    <div
      className={`fixed inset-x-20 top-20 z-[120] flex items-start justify-center bg-transparent transition-opacity duration-300 ${
        showsearch && isVisible
          ? "opacity-100"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`relative z-[121] w-full max-w-lg mx-auto p-4 bg-white rounded-lg shadow-lg transform transition-transform duration-300 ${
          showsearch && isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ border: "1px solid gray" }}
      >
        <button
          type="button"
          className="absolute right-0 top-0 mt-2 mr-2 text-gray-600"
          onClick={handleCloseClick}
        >
          <img src={crossicon} alt="Close" className="w-2 h-2" />
        </button>
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={search}
            onChange={handleInputChange}
            placeholder="Search product name, brand, storage, or variant..."
            className="w-full px-6 py-3 pr-28 text-gray-700 bg-transparent border border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            className={`absolute right-14 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full transition-colors ${
              isListening ? "animate-pulse text-red-600" : "text-gray-600 hover:text-red-600"
            }`}
            onClick={startVoiceSearch}
            aria-label={isListening ? "Listening for voice search" : "Start voice search"}
            title={isListening ? "Listening" : "Voice search"}
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="9" y="3" width="6" height="11" rx="3" />
              <path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8" />
            </svg>
          </button>
          <button
            type="submit"
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-blue-500"
          >
            <img src={searchicon} alt="Search" className="w-6 h-6" />
          </button>
        </form>
        {searchMessage && (
          <p className="mt-3 text-sm text-red-600">{searchMessage}</p>
        )}
        {matchedProducts.length > 0 && (
          <div className="relative z-[122] mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {matchedProducts.map((product) => (
              <button
                type="button"
                key={product._id}
                className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left last:border-b-0 hover:bg-gray-50"
                onClick={() => openProduct(product)}
              >
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                  {product.image?.[0] ? (
                    <img
                      src={product.image[0]}
                      alt={product.name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="text-[10px] uppercase tracking-[0.18em] text-gray-400">
                      No img
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-800">
                    {product.name}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {product.brand} • {product.priceLabel}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Searchbar;
