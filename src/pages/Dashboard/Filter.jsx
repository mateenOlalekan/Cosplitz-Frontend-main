import React, { useState } from "react";
import { splits } from "../../Data/Alldata";
import { Heart, Share2, Users, Clock, MapPin } from "lucide-react";

export default function Filter() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState(0);
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
    <div className="min-h-screen px-4 md:px-6 py-2">
      {/* Sticky Header */}
      <div className="flex justify-between items-center sticky top-0 z-20 pb-1.5 pt-1">
        <span className="text-lg font-bold text-gray-800">Filter</span>
        <button
          onClick={clearAll}
          className="text-sm text-green-600 font-semibold cursor-pointer hover:text-green-700 transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Category Section */}
      <div className="mt-2">
        <h2 className="text-gray-800 font-semibold text-base mb-1.5">Category</h2>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 flex-nowrap">
          {categories.map((cate, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(cate)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full border text-sm transition-colors ${
                selectedCategory === cate
                  ? "bg-green-600 text-white border-green-600 shadow-sm"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
              }`}
            >
              {cate}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mt-3">
        <label className="font-semibold text-gray-800 block text-sm mb-2">
          Price Range: <span className="text-green-600">$0 - ${priceRange}</span>
        </label>

        <div className="px-1">
          <input
            type="range"
            min="0"
            max="100"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="w-full h-1.5 accent-green-600 cursor-pointer rounded-full"
          />
        </div>

        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>$0</span>
          <span>$50</span>
          <span>$100</span>
        </div>
      </div>

      {/* Location Section */}
      <div className="mt-3">
        <h2 className="text-gray-800 font-semibold text-base mb-3 flex items-center gap-2">
          <MapPin size={16} className="text-gray-600" /> Location
        </h2>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 flex-nowrap">
          {locations.map((loc, index) => (
            <button
              key={index}
              onClick={() => setSelectedLocation(loc)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full border text-sm transition-colors ${
                selectedLocation === loc
                  ? "bg-green-600 text-white border-green-600 shadow-sm"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mt-3 mb-2">
        <div className="flex items-center justify-between">
          <span className="text-gray-700 font-medium text-sm">
            Showing {filteredSplits.length} results
          </span>
          <span className="text-xs text-gray-500">
            Total: {filteredSplits.length}
          </span>
        </div>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-2">
        {filteredSplits.map((split) => (
          <div
            key={split.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden"
          >
            {/* Image Section */}
            <div className="relative">
              <img
                src={split.image}
                alt={split.title}
                className="w-full h-44 sm:h-48 object-cover"
              />

              <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                {split.badge}
              </span>

              <div className="absolute top-2 right-2 flex gap-1.5">
                <button className="bg-black/70 hover:bg-white p-1.5 rounded-full transition-colors">
                  <Heart size={14} className="text-white hover:text-red-500" />
                </button>

                <button className="bg-black/70 hover:bg-white p-1.5 rounded-full transition-colors">
                  <Share2 size={14} className="text-white hover:text-green-600" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-3 space-y-2">
              {/* Title and Category */}
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 pr-2">
                  {split.title}
                </h3>
                <span className={`${split.bgtext} text-xs px-2 py-1 rounded-full flex-shrink-0`}>
                  {split.name}
                </span>
              </div>

              {/* Distance */}
              <p className="text-xs text-gray-600 flex items-center">
                <MapPin className="inline-block w-3 h-3 mr-1 text-gray-500" />
                {split.distance}
              </p>

              {/* Participants & Time */}
              <div className="flex items-center justify-between text-xs text-gray-700 pt-1">
                <div className="flex items-center gap-1">
                  <Users size={12} className="text-gray-500" />
                  <span>{split.participants}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={12} className="text-gray-500" />
                  <span>{split.timeLeft}</span>
                </div>
              </div>

              {/* Price and Join Button */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-green-600 font-bold text-sm">
                  {split.price}
                </span>
                <button className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}