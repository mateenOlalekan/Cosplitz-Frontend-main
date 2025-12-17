import React, { useState } from "react";
import { splits } from "../../Data/Alldata"; // Import your splits data
import { Heart, Share2, Users, Clock, MapPin, Users2 } from "lucide-react";

export default function Filter() {
  // Add missing properties to splits data for filtering
  const enhancedSplits = splits.map((item) => ({
    ...item,
    category: item.badge || item.name, // Use badge as category if available
    priceValue: parseFloat(item.price.replace("₦", "").replace(",", "")) || 0,
    distanceValue: parseFloat(item.distance.replace(" km", "")) || 0,
  }));

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState(5000); // Set max price range
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
    return parseFloat(loc.replace("Within ", "").replace("km", ""));
  };

  const filteredSplits = enhancedSplits.filter((item) => {
    // Category filter
    const categoryMatch =
      selectedCategory === "All" || item.category === selectedCategory;

    // Price filter
    const priceMatch = item.priceValue <= priceRange;

    // Location filter
    const locationMatch =
      selectedLocation === "All Locations" ||
      item.distanceValue <= getKmValue(selectedLocation);

    return categoryMatch && priceMatch && locationMatch;
  });

  const clearAll = () => {
    setSelectedCategory("All");
    setPriceRange(5000); // Reset to max price
    setSelectedLocation("All Locations");
  };

  // Calculate max price for range slider
  const maxPrice = Math.max(...enhancedSplits.map(item => item.priceValue));

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
          Price Range: <span className="text-green-600">₦0 - ₦{priceRange}</span>
        </label>

        <div className="px-1">
          <input
            type="range"
            min="0"
            max={maxPrice}
            value={priceRange}
            onChange={(e) => setPriceRange(parseInt(e.target.value))}
            className="w-full h-1.5 accent-green-600 cursor-pointer rounded-full"
          />
        </div>

        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>₦0</span>
          <span>₦{Math.floor(maxPrice/2)}</span>
          <span>₦{maxPrice}</span>
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
      <div className="mt-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-700 font-medium text-sm">
            Showing {filteredSplits.length} results
          </span>
          <span className="text-xs text-gray-500">
            Total: {filteredSplits.length}
          </span>
        </div>
      </div>

      {/* Splits Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-8">
        {filteredSplits.map((item) => (
          <div
            key={item.id}
            className="relative flex flex-col justify-between rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group bg-white h-fit"
          >
            {/* Image Section */}
            <div className="relative h-40 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3">
                <div
                  className="rounded-xl py-1 px-3 text-sm font-medium"
                  style={{
                    backgroundColor: item.descbg,
                    color: item.desctext,
                  }}
                >
                  {item.special}
                </div>
              </div>
              <div className="absolute top-3 right-3 flex gap-2">
                <button className="bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                  <Heart size={16} className="text-gray-700" />
                </button>
                <button className="bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                  <Share2 size={16} className="text-gray-700" />
                </button>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-4 flex flex-col gap-3">
              {/* Title and Badge */}
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                  {item.title}
                </h3>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${item.bgtext}`}
                  style={{ color: item.textcolor }}
                >
                  {item.badge}
                </div>
              </div>

              {/* Description */}
              <div
                className="px-3 py-1.5 rounded-lg text-sm font-medium inline-flex w-fit"
                style={{
                  backgroundColor: item.descbg,
                  color: item.desctext,
                }}
              >
                {item.desc}
              </div>

              {/* Creator Info */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                  {item.creator.charAt(0)}
                </div>
                <span className="text-sm text-gray-600">{item.creator}</span>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span>★ {item.rating}</span>
                  <span className="text-green-600 ml-2">Trust {item.trust}</span>
                </div>
              </div>

              {/* Details */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{item.participants}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{item.timeLeft}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{item.distance}</span>
                  </div>
                </div>
              </div>

              {/* Price and Action */}
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="text-left">
                  <div className="text-2xl font-bold text-gray-900">
                    {item.price}
                  </div>
                  <div className="text-xs text-gray-500">per person</div>
                </div>
                <button className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                  Join Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {filteredSplits.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">No results found</div>
          <p className="text-gray-500 text-sm mb-4">
            Try adjusting your filters
          </p>
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}