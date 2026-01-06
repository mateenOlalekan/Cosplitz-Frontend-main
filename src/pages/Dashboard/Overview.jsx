import { useState } from "react";
import {
  Heart,
  Share2,
  Users,
  Clock,
  MapPin,
  Bell,
  Settings,
  Search,
  ListFilter,
} from "lucide-react";
import { Link } from "react-router-dom";
import DashOverview from "../../components/Headers/Overview";

import AllSplitsPage from "../../components/Splitz/AllSplitsPage";
import { formatPrice } from "../../utils/splitsutls";

function Overview({ setSidebarOpen, sidebarOpen }) {
  // const [activeTab, setActiveTab] = useState("All Active");
  const [hidden, setHidden] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
    priceRange: [0, 100000],
    distance: "All",
    searchQuery: "",
  });
  const [priceSliderValue, setPriceSliderValue] = useState([0, 100000]);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [showDeals, setShowDeals] = useState(true);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // // Use real data from splitStore
  // const { allSplits, fetchAllSplits, joinSplit, isLoading } = useSplitStore();
  // const user = useAuthStore((state) => state.user);

  const hideComponent = () => {
    setHidden((prev) => !prev);
  };

  // Fetch splits on component mount
  // useEffect(() => {
  //   fetchAllSplits();
  // }, []);

  // Update max price based on fetched splits
  // useEffect(() => {
  //   if (allSplits.length > 0) {
  //     const prices = allSplits.map((split) => {
  //       const price = parseFloat(split.amount) || 0;
  //       return isNaN(price) ? 0 : price;
  //     });
  //     const maxTaskPrice = Math.max(...prices);
  //     const roundedMax = Math.ceil(maxTaskPrice / 10000) * 10000 || 100000;
  //     setMaxPrice(roundedMax);
  //     setPriceSliderValue([0, roundedMax]);
  //     setFilters((prev) => ({
  //       ...prev,
  //       priceRange: [0, roundedMax],
  //     }));
  //   }
  // }, [allSplits]);

  // Filter categories
  const filterCategories = [
    "All",
    "Ride",
    "Groceries",
    "Food",
    "Utilities",
    "Entertainment",
    "Other",
  ];

  const distances = ["All", "1km", "2km", "3km", "5km", "7km", "10km"];

  // // Reset filters
  const resetFilters = () => {
    setFilters({
      category: "all",
      priceRange: [0, maxPrice],
      distance: "All",
      searchQuery: "",
    });
    setPriceSliderValue([0, maxPrice]);
    setIsSearchFocused(false);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  // Get badge text based on category

  return (
    <div className="w-full min-h-screen bg-white transition-all duration-300 p-3 md:p-4">
      {/* Dashboard Header */}
      <div className="w-full flex flex-col pb-4">
        <div className="flex flex-col">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#67707E]">
              <MapPin size={17} />
              <div className="text-sm font-medium">Ikeja, Lagos, Nigeria</div>
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-2">
              {/* Notification */}
              <Link
                to="/dashboard/notification"
                className="relative p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Notifications"
              >
                <Bell size={17} className="text-[#67707E]" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Link>

              {/* Settings */}
              <Link
                to="/dashboard/settings"
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Settings"
              >
                <Settings size={17} className="text-[#67707E]" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="w-full flex flex-col gap-3 space-y-2">
        <div className="flex justify-between items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors duration-300" />
            <input
              type="text"
              placeholder="Search tasks by title, category, location, or amount..."
              value={filters.searchQuery}
              onClick={hideComponent}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
              }
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-300"
            />
          </div>
          <button
            className="p-2.5 text-[#67707E] border border-[#67707E] rounded-lg hover:bg-green-600 hover:text-white hover:border-green-600 transition-colors duration-200"
            aria-label="Filter options"
          >
            <ListFilter size={20} />
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      <div
        className={`
          bg-white mb-2 mt-2 space-y-2
          transition-all duration-500 ease-in-out
          overflow-hidden
          ${
            hidden
              ? "opacity-100 translate-y-0 max-h-[1000px] scale-100"
              : "opacity-0 -translate-y-4 max-h-0 scale-95 pointer-events-none"
          }
        `}
      >
        {/* Category Filter */}
        <div className="transition-opacity duration-500">
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <button
              onClick={resetFilters}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg font-medium hover:bg-gray-200 transition-all duration-300"
            >
              Clear Filters
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {filterCategories.map((category) => {
              const isActive = filters.category === category;
              return (
                <button
                  key={category}
                  onClick={() => setFilters((prev) => ({ ...prev, category }))}
                  className={`
                    px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105
                    ${
                      isActive
                        ? "bg-green-600 text-white shadow-lg scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }
                  `}
                >
                  {category === "all"
                    ? "All"
                    : category === "groceries"
                    ? "Groceries"
                    : category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Distance Filter */}
        <div className="transition-opacity duration-500">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Distance
          </label>

          <div className="flex flex-wrap gap-2">
            {distances.map((distance) => {
              const isActive = filters.distance === distance;
              return (
                <button
                  key={distance}
                  onClick={() => setFilters((prev) => ({ ...prev, distance }))}
                  className={`
                    px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105
                    ${
                      isActive
                        ? "bg-green-600 text-white shadow-lg scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }
                  `}
                >
                  {distance === "All" ? "All Distances" : `Within ${distance}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Slider */}
        <div className="transition-opacity duration-500">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range: {formatPrice(filters.priceRange[0])} -{" "}
            {formatPrice(filters.priceRange[1])}
          </label>
          <div className="space-y-4">
            <div className="relative h-2">
              {/* Track background */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gray-300 rounded-full transition-all duration-500"></div>

              {/* Colored track between thumbs */}
              <div
                className="absolute top-0 h-2 bg-green-500 rounded-full transition-all duration-500"
                style={{
                  left: `${(priceSliderValue[0] / maxPrice) * 100}%`,
                  right: `${100 - (priceSliderValue[1] / maxPrice) * 100}%`,
                }}
              ></div>

              {/* Thumb indicators */}
              <div
                className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-green-600 rounded-full shadow cursor-pointer z-30 transition-all duration-300 hover:scale-125"
                style={{ left: `${(priceSliderValue[0] / maxPrice) * 100}%` }}
              />
              <div
                className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-green-600 rounded-full shadow cursor-pointer z-30 transition-all duration-300 hover:scale-125"
                style={{ left: `${(priceSliderValue[1] / maxPrice) * 100}%` }}
              />

              {/* Min thumb */}
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceSliderValue[0]}
                onChange={(e) => handlePriceChange(0, e.target.value)}
                className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer z-10"
              />

              {/* Max thumb */}
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceSliderValue[1]}
                onChange={(e) => handlePriceChange(1, e.target.value)}
                className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer z-20"
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{formatPrice(0)}</span>
              <span>{formatPrice(maxPrice)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Overview Component */}
      <div
        className={`
        transition-all duration-500 ease-in-out
        ${
          hidden
            ? "opacity-0 translate-y-4 scale-95 pointer-events-none hidden"
            : "opacity-100 translate-y-0 scale-100 block"
        }
      `}
      >
        <DashOverview />
      </div>

      {/* Main Content */}
      <AllSplitsPage />
    </div>
  );
}

export default Overview;
