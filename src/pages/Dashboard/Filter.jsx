import React, { useState } from "react";
import { splits } from "../../Data/Alldata";
import { Heart, Share2, Users, Clock, MapPin } from "lucide-react";

export default function Filter() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState(100);
  const [selectedLocation, setSelectedLocation] = useState("All Locations");

  const categories = [
    "All",
    "Ride",
    "Groceries",
    "Food",
    "Entertainment",
    "Shopping",
    "Service",
  ];

  const locations = [
    "All Locations",
    "Within 1km",
    "Within 3km",
    "Within 5km",
    "Within 7km",
    "Within 10km",
  ];

  const getKmValue = (loc) => {
    if (loc === "All Locations") return Infinity;
    return parseInt(loc.replace("Within ", "").replace("km", ""));
  };

  const filteredSplits = splits.filter((item) => {
    const categoryMatch =
      selectedCategory === "All" || item.category === selectedCategory;

    const priceMatch = item.priceValue <= priceRange;

    const locationMatch =
      selectedLocation === "All Locations" ||
      item.distanceValue <= getKmValue(selectedLocation);

    return categoryMatch && priceMatch && locationMatch;
  });

  const clearAll = () => {
    setSelectedCategory("All");
    setPriceRange(100);
    setSelectedLocation("All Locations");
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-10 py-4">
      {/* Sticky Header (mobile-friendly) */}
      <div className="flex justify-between items-center sticky top-0 z-20 ">
        <span className="text-lg font-bold">Filter</span>
        <span
          onClick={clearAll}
          className="text-lg text-green-600 font-bold cursor-pointer"
        >
          Clear All
        </span>
      </div>

      {/* Category Section */}
      <div className="mt-2">
        <h1 className="text-black font-semibold">Category</h1>

        <div className="flex gap-3 mt-3 overflow-x-auto scrollbar-hide pb-1 flex-nowrap">
          {categories.map((cate, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(cate)}
              className={`whitespace-nowrap px-4 py-2 rounded-full border text-sm sm:text-base ${
                selectedCategory === cate
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-black border-gray-300"
              }`}
            >
              {cate}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="w-full mt-2">
        <label className="font-semibold block text-sm sm:text-base">
          Price Range : $0 - ${priceRange}
        </label>

        <input
          type="range"
          min="0"
          max="100"
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          className="w-full accent-green-500 cursor-pointer"
        />

       
      </div>

      {/* Location Section */}
      <div className="mt-2">
        <h1 className="text-black font-semibold flex items-center gap-2 text-sm sm:text-base">
          <MapPin size={18} /> Location
        </h1>

        <div className="flex gap-3 mt-3 overflow-x-auto pb-1 scrollbar-hide flex-nowrap">
          {locations.map((loc, index) => (
            <button
              key={index}
              onClick={() => setSelectedLocation(loc)}
              className={`whitespace-nowrap px-4 py-2 rounded-full border text-sm sm:text-base ${
                selectedLocation === loc
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-black border-gray-300"
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* Number of items */}
      <p className="mt-4 text-gray-500 text-sm sm:text-base">
        Total: {filteredSplits.length}
      </p>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-5 pb-10">
        {filteredSplits.map((split) => (
          <div
            key={split.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-3"
          >
            {/* Image Section */}
            <div className="relative">
              <img
                src={split.image}
                alt={split.title}
                className="w-full h-44 sm:h-48 md:h-52 object-cover rounded-lg mb-3"
              />

              <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                {split.badge}
              </span>

              <div className="absolute top-2 right-2 flex gap-2">
                <button className="bg-black/60 p-1.5 rounded-full hover:bg-white transition">
                  <Heart size={16} className="text-white" />
                </button>

                <button className="bg-black/60 p-1.5 rounded-full hover:bg-white transition">
                  <Share2 size={16} className="text-white" />
                </button>
              </div>
            </div>

            {/* Title */}
            <div className="flex justify-between items-center">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                {split.title}
              </h3>
              <span className={`${split.bgtext} text-xs px-2 py-1 rounded-full`}>
                {split.name}
              </span>
            </div>

            {/* Distance */}
            <p className="text-xs sm:text-sm text-gray-500 mt-1 mb-2">
              <MapPin className="inline-block w-3 h-3 mr-1" />
              {split.distance}
            </p>

            {/* Participants & Time */}
            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600">
              <p className="flex items-center gap-1">
                <Users size={12} /> {split.participants}
              </p>
              <p className="flex items-center gap-1">
                <Clock size={12} /> {split.timeLeft}
              </p>
            </div>

            {/* Price + Join */}
            <div className="flex items-center justify-between mt-3">
              <p className="text-green-600 font-semibold text-sm sm:text-base">
                {split.price}
              </p>
              <button className="text-sm sm:text-base text-green-600 hover:underline">
                Join
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
