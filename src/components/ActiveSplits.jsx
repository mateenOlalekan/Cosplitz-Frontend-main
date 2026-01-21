import { useState } from "react";
import { Heart, Share2, Users, Clock, MapPin, Users2 } from "lucide-react";
import { useSplitsQuery } from "../services/queries/splits";
import placeholderImage from "../assets/onboard3.jpg";

// Helper function to transform API data to component format
const transformSplitData = (apiSplit) => {
  // Calculate time left from created_at
  const getTimeLeft = (createdAt) => {
    if (!createdAt) return "N/A";
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now - created;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} left`;
    if (diffHours > 0) return `${diffHours}h left`;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    return `${diffMins} min left`;
  };

  // Get category styling based on category name
  const getCategoryStyle = (category) => {
    const categoryLower = category?.toLowerCase() || "";
    if (categoryLower.includes("food") || categoryLower.includes("groceries")) {
      return {
        name: "food",
        textcolor: "#65CADF",
        bgtext: "bg-[rgba(101,202,223,0.16)]",
        badge: "Food",
      };
    }
    if (categoryLower.includes("transport") || categoryLower.includes("ride")) {
      return {
        name: "ride",
        textcolor: "#FB9851",
        bgtext: "bg-[rgba(251,152,81,0.16)]",
        badge: "Ride",
      };
    }
    if (categoryLower.includes("event") || categoryLower.includes("ticket")) {
      return {
        name: "event",
        textcolor: "#65CADF",
        bgtext: "bg-[rgba(101,202,223,0.16)]",
        badge: "Event",
      };
    }
    // Default
    return {
      name: categoryLower || "other",
      textcolor: "#65CADF",
      bgtext: "bg-[rgba(101,202,223,0.16)]",
      badge: category || "Split",
    };
  };

  const categoryStyle = getCategoryStyle(apiSplit.category);
  const pricePerPerson = apiSplit.max_participants > 0 
    ? Math.round(apiSplit.amount / apiSplit.max_participants)
    : apiSplit.amount;

  return {
    id: apiSplit.id,
    title: apiSplit.title || "Untitled Split",
    image: apiSplit.image_url || placeholderImage,
    badge: categoryStyle.badge,
    name: categoryStyle.name,
    textcolor: categoryStyle.textcolor,
    bgtext: categoryStyle.bgtext,
    price: `₦${pricePerPerson.toLocaleString()}`,
    participants: `0/${apiSplit.max_participants || 0}`,
    timeLeft: getTimeLeft(apiSplit.created_at),
    distance: apiSplit.location || "Unknown location",
  };
};

function ActiveSplits({ activeTab: externalActiveTab, setActiveTab: externalSetActiveTab }) {
  const [internalActiveTab, setInternalActiveTab] = useState("All Active");
  
  // Use external state if provided, otherwise use internal state
  const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab;
  const setActiveTab = externalSetActiveTab || setInternalActiveTab;

  // Fetch splits using TanStack Query
  const { data: splitsData, isLoading, error } = useSplitsQuery();

  console.log(splitsData);
  // Transform API data to component format
  const transformedSplits = splitsData ? splitsData.map(transformSplitData) : [];

  // Filter splits based on active tab
  const filteredSplits = transformedSplits.filter((split) => {
    if (activeTab === "All Active") return true;
    if (activeTab === "Food") return split.name === "food";
    if (activeTab === "Rides") return split.name === "ride";
    if (activeTab === "Popular") return split.participants.split("/")[0] > 0;
    if (activeTab === "Newest") return true; // Could add sorting by date
    if (activeTab === "Tools") return split.name === "tools";
    return true;
  });

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900 mb-3">
        Active Nearby Splittz
      </h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        {["All Active", "Popular", "Newest", "Food", "Rides", "Tools"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
              activeTab === tab
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading splits...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-4 rounded-lg text-center">
          {error.message || "Failed to load splits. Please try again later."}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredSplits.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No splits found.</p>
        </div>
      )}

      {/* Cards */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSplits.map((split) => (
      <div
        key={split.id}
        className="bg-[#F3F3F3] rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-1.5 border border-gray-100"
      >
        {/* Image Container */}
        <div className="relative">
          <img
            src={split.image}
            alt={split.title}
            className="w-full h-40 sm:h-48 object-cover rounded-lg mb-3"
          />

          {/* Badge */}
          <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
            {split.badge}
          </span>

          {/* Action Buttons */}
          <div className="absolute top-2 right-2 flex gap-2">
            <button className="bg-black/60 p-1.5 rounded-full hover:bg-white transition-all">
              <Heart size={16} className="text-white hover:text-red-500" />
            </button>
            <button className="bg-black/60 p-1.5 rounded-full hover:bg-white transition-all">
              <Share2 size={16} className="text-white hover:text-green-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1 p-1.5">
          {/* Title and Category */}
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
              {split.title}
            </h3>
            <span 
              className={`${split.bgtext} text-xs px-2 py-1 rounded-full`}
              style={{ color: split.textcolor }}
            >
              {split.name}
            </span>
          </div>

          {/* Location */}
          <p className="flex-inline text-xs flex items-center">
            <span className="text-[#1F8225] font-bold">{split.price}</span>/person
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-gray-600 pt-2 ">
            <p className="flex items-center gap-1">
              <Users size={12} /> {split.participants}
            </p>
            <p className="flex items-center text-[#E60000] gap-1">
              <Clock size={12} /> {split.timeLeft}
            </p>
            <div className="flex flex-inline">
              <MapPin className="inline-block w-3 h-3 font-bold text-[#1F8225]" />
              {split.distance}
            </div>
          </div>

          {/* Price and Action */}
          <div className="flex items-center justify-between pt-2 ">
            <p className="text-green-600 font-semibold">{split.price}</p>
            <button className="px-3 py-1.5 text-sm bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors">
              Join Splitz
            </button>
          </div>
        </div>
        </div>
      ))}
    </div>
      )}
    </section>
  );
}

export default ActiveSplits;