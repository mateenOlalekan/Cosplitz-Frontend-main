// src/pages/dashboard/Overview.js
import { useState, useEffect } from "react";
import { Heart, Share2, Users, Clock, MapPin, Bell, Settings, Search, ListFilter } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useSplitStore from "../../store/splitStore";
import useAuthStore from "../../store/authStore";
import DashOverview from "../../components/Headers/Overview";
import Overlay1 from "../../assets/Overlay.svg";
import Overlay2 from "../../assets/Overlay1.svg";
import Overlay3 from "../../assets/Overlay2.svg";
import Overlay4 from "../../assets/Overlay3.svg";

function Overview({ setSidebarOpen, sidebarOpen }) {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("All Active");
  const [hidden, setHidden] = useState(false);

  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const [filters, setFilters] = useState({
    category: "all",
    priceRange: [0, 100000],
    distance: "All",
    searchQuery: "",
  });

  const [priceSliderValue, setPriceSliderValue] = useState([0, 100000]);
  const [maxPrice, setMaxPrice] = useState(100000);

  const { allSplits, fetchAllSplits, joinSplit, isLoading } = useSplitStore();
  const user = useAuthStore((state) => state.user);

  const hideComponent = () => {
    setHidden((prev) => !prev);
  };

  // ------------------------------
  // FIXED: Missing Functions
  // ------------------------------
  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    setHidden(true); // hide top overview on search focus
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
    // setHidden(false); // remove if you want it to reappear
  };
  // ------------------------------

  // Fetch Splits
  useEffect(() => {
    fetchAllSplits();
  }, []);

  // Update Price Slider Limits
  useEffect(() => {
    if (allSplits.length > 0) {
      const prices = allSplits.map((s) => parseFloat(s.amount) || 0);
      const maxP = Math.ceil(Math.max(...prices) / 10000) * 10000 || 100000;

      setMaxPrice(maxP);
      setPriceSliderValue([0, maxP]);

      setFilters((prev) => ({
        ...prev,
        priceRange: [0, maxP],
      }));
    }
  }, [allSplits]);

  // Helpers
  const parsePrice = (price) => parseFloat(price) || 0;

  const formatPrice = (price) => `₦${parseFloat(price).toLocaleString()}`;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handlePriceChange = (index, value) => {
    const newVal = [...priceSliderValue];
    newVal[index] = parseInt(value) || 0;

    if (newVal[0] > newVal[1]) newVal[1] = newVal[0];
    if (newVal[1] < newVal[0]) newVal[0] = newVal[1];

    setPriceSliderValue(newVal);

    setFilters((prev) => ({
      ...prev,
      priceRange: newVal,
    }));
  };

  // ------------------------------
  // FILTERING LOGIC (CLEANED)
  // ------------------------------
  const filteredSplits = allSplits.filter((split) => {
    const amount = parsePrice(split.amount);

    if (amount < filters.priceRange[0] || amount > filters.priceRange[1]) return false;

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      return (
        split.title?.toLowerCase().includes(q) ||
        split.category?.toLowerCase().includes(q) ||
        split.location?.toLowerCase().includes(q) ||
        split.description?.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const handleJoinSplit = async (id, e) => {
    e.stopPropagation();
    await joinSplit(id);
    navigate(`/dashboard/splitz-details/${id}`);
  };

  const tabFilters = ["All Active", "Popular", "Newest", "Food", "Rides", "Tools"];

  return (
    <div className="w-full min-h-screen bg-white p-3 md:p-4 transition-all">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex text-[#67707E] items-center gap-2">
          <MapPin size={18} />
          <span className="text-sm">Ikeja, Lagos, Nigeria</span>
        </div>

        <div className="flex gap-3 items-center">
          <Link to="/dashboard/notification" className="relative p-1.5">
            <Bell size={19} className="text-[#67707E]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Link>
          <Link to="/dashboard/settings" className="p-1.5">
            <Settings size={19} className="text-[#67707E]" />
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="mt-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.searchQuery}
            onClick={hideComponent}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            onChange={(e) =>
              setFilters((f) => ({ ...f, searchQuery: e.target.value }))
            }
            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-green-500"
          />
        </div>

        <button className="p-3 border rounded-lg">
          <ListFilter />
        </button>
      </div>

      {/* Overview Component */}
      <div
        className={`transition-all duration-500 ${hidden ? "opacity-0 scale-95 hidden" : "opacity-100 scale-100"}`}
      >
        <DashOverview />
      </div>

      {/* MAIN SPLIT GRID */}
      <main className="mt-6">
        <h2 className="font-semibold text-lg mb-3">Active Nearby Splitz</h2>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-3">
          {tabFilters.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm rounded-full ${
                activeTab === tab
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Splits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-56 bg-gray-200 animate-pulse rounded-xl" />
            ))
          ) : filteredSplits.length ? (
            filteredSplits.map((split) => {
              const participants = split.participants?.length || 0;
              const max = split.max_participants || 1;
              const perPerson = parsePrice(split.amount) / max;

              return (
                <div
                  key={split.id}
                  className="bg-gray-100 p-2 rounded-xl shadow-sm"
                >
                  <img
                    src={split.image || "https://via.placeholder.com/400"}
                    className="h-48 w-full object-cover rounded-lg"
                  />

                  <div className="p-2">
                    <h3 className="font-semibold text-sm">{split.title}</h3>

                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(split.status)}`}>
                      {split.status}
                    </span>

                    <p className="mt-2 text-sm">
                      <span className="text-green-600 font-bold">{formatPrice(perPerson)}</span>/person
                    </p>

                    <button
                      className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg text-sm w-full"
                      onClick={(e) => handleJoinSplit(split.id, e)}
                    >
                      Join Splitz
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center col-span-full text-gray-500 py-8">
              No splits available.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export default Overview;
