import { useState, useEffect, useRef } from "react";
import { Heart, Share2, Users, Clock, MapPin, Menu, Bell, Settings, Search, ListFilter } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Overlay1 from "../../assets/Overlay.svg";
import Overlay2 from "../../assets/Overlay1.svg";
import Overlay3 from "../../assets/Overlay2.svg";
import Overlay4 from "../../assets/Overlay3.svg";
import { splits } from "../../Data/Alldata";
import logo from "../../assets/logo.svg";
import DashOverview from "../../components/Headers/Overview";

function Overview({ setSidebarOpen, sidebarOpen }) {
  const [activeTab, setActiveTab] = useState("All Active");
  const [hidden,setHidden] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 100000],
    distance: 'All',
    searchQuery: ''
  });
  const [priceSliderValue, setPriceSliderValue] = useState([0, 100000]);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [showDeals, setShowDeals] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [dealsHeight, setDealsHeight] = useState('auto');
  const dealsRef = useRef(null);
  const navigate = useNavigate();

  const hideComponent = ()=>{
    setHidden((prev)=>!prev)
  }

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('allSplitzTasks') || '[]');
    setTasks(savedTasks);
    
    if (savedTasks.length > 0) {
      const prices = savedTasks.map(task => {
        const priceStr = String(task.totalAmount || '0').replace(/[^0-9]/g, '');
        return parseInt(priceStr) || 0;
      });
      const maxTaskPrice = Math.max(...prices);
      const roundedMax = Math.ceil(maxTaskPrice / 10000) * 10000 || 100000;
      setMaxPrice(roundedMax);
      setPriceSliderValue([0, roundedMax]);
      setFilters(prev => ({
        ...prev,
        priceRange: [0, roundedMax]
      }));
    }
  }, []);

  useEffect(() => {
    if (dealsRef.current) {
      setDealsHeight(`${dealsRef.current.scrollHeight}px`);
    }
  }, []);

  useEffect(() => {
    if (isSearchFocused || filters.searchQuery) {
      setShowDeals(false);
    } else {
      setShowDeals(true);
    }
  }, [isSearchFocused, filters.searchQuery]);

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  const filterCategories = [
    'All',
    'Ride',
    'Groceries',
    'Food',
    'Utilities',
    'Entertainment',
    'Other'
  ];

  const distances = ['All', '1km', '2km', '3km', '5km', '7km', '10km'];

  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    const price = String(priceStr).replace(/[^0-9]/g, '');
    return parseInt(price) || 0;
  };

  const parseDistance = (distanceStr) => {
    if (!distanceStr || distanceStr === 'All') return Infinity;
    const km = String(distanceStr).replace('km', '').trim();
    return parseFloat(km) || 0;
  };

  const filteredTasks = tasks.filter(task => {
    if (filters.category !== 'all') {
      if (filters.category === 'groceries') {
        if (task.category !== 'Food & Groceries') return false;
      } else if (task.category !== filters.category) {
        return false;
      }
    }

    const taskPrice = parsePrice(task.totalAmount);
    if (taskPrice < filters.priceRange[0] || taskPrice > filters.priceRange[1]) {
      return false;
    }

    if (filters.distance !== 'All') {
      const maxDistance = parseDistance(filters.distance);
      const taskDistance = parseDistance(task.visibility || '0km');
      if (taskDistance > maxDistance) {
        return false;
      }
    }

    if (filters.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      const taskTitle = (task.splitTitle || '').toLowerCase();
      const taskCategory = (task.category || '').toLowerCase();
      const taskLocation = (task.location || '').toLowerCase();
      const taskAmount = (task.totalAmount || '').toLowerCase();
      
      return (
        taskTitle.includes(searchLower) ||
        taskCategory.includes(searchLower) ||
        taskLocation.includes(searchLower) ||
        taskAmount.includes(searchLower)
      );
    }

    return true;
  });

  const handlePriceChange = (index, value) => {
    const newValue = [...priceSliderValue];
    newValue[index] = parseInt(value) || 0;
    
    if (index === 0 && newValue[0] > newValue[1]) newValue[1] = newValue[0];
    if (index === 1 && newValue[1] < newValue[0]) newValue[0] = newValue[1];
    
    setPriceSliderValue(newValue);
    setFilters(prev => ({ ...prev, priceRange: newValue }));
  };

  const formatPrice = (price) => {
    return `₦${price.toLocaleString()}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Food & Groceries': return 'bg-red-100 text-red-800';
      case 'Transportation': return 'bg-blue-100 text-blue-800';
      case 'Events & Tickets': return 'bg-purple-100 text-purple-800';
      case 'Utilities': return 'bg-yellow-100 text-yellow-800';
      case 'Entertainment': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const categories = [
    { icon: Overlay1, label: "Split Expenses" },
    { icon: Overlay2, label: "Bulk Orders & Riders" },
    { icon: Overlay3, label: "Borrow/Lend" },
    { icon: Overlay4, label: "Crowdfund" },
  ];

  const resetFilters = () => {
    setFilters({
      category: 'all',
      priceRange: [0, maxPrice],
      distance: 'All',
      searchQuery: ''
    });
    setPriceSliderValue([0, maxPrice]);
    setIsSearchFocused(false);
  };

  const tabFilters = ["All Active", "Popular", "Newest", "Food", "Rides", "Tools"];

  return (
    <div className="w-full min-h-screen bg-white transition-all duration-300 p-3 md:p-4">
      {/* Dashboard Header */}
      <div className="w-full flex flex-col pb-4">
        <div className="flex flex-col">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#67707E]">
              <MapPin size={17} />
              <div className="text-sm font-medium">
                Ikeja, Lagos, Nigeria
              </div>
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

        {/* Location and Action Icons */}

      <div className="w-full flex flex-col gap-3 space-y-2">
        <div className='flex justify-between items-center gap-2'>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors duration-300" />
            <input 
              type="text" 
              placeholder="Search tasks by title, category, location, or amount..." 
              value={filters.searchQuery} 
              onClick={hideComponent}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-300"
            />
          </div>          
          <button className="p-2.5 text-[#67707E] border border-[#67707E] rounded-lg hover:bg-green-600 hover:text-white hover:border-green-600 transition-colors duration-200" aria-label="Filter options">
            <ListFilter size={20} />
          </button>
        </div>
      </div>

      {/* Filter Panel */}
<div
  className={`
    bg-white   mb-2 mt-2 space-y-2
    transition-all duration-500 ease-in-out
    overflow-hidden
    ${hidden
      ? "opacity-100 translate-y-0 max-h-[1000px] scale-100"
      : "opacity-0 -translate-y-4 max-h-0 scale-95 pointer-events-none"}
  `}
>
        {/* Category Filter */}
        <div className="transition-opacity duration-500">
          <div className='flex justify-between items-center mb-3'>  
            <label className="block text-sm font-medium text-gray-700">Category</label>
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
                  onClick={() => setFilters(prev => ({ ...prev, category }))}
                  className={`
                    px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105
                    ${isActive
                      ? "bg-green-600 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }
                  `}
                >
                  {category === "all" ? "All" : category === "groceries" ? "Groceries" : category}
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
                  onClick={() => setFilters(prev => ({ ...prev, distance }))}
                  className={`
                    px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105
                    ${isActive
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
            Price Range: {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
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
                  right: `${100 - (priceSliderValue[1] / maxPrice) * 100}%`
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
    ${hidden
      ? "opacity-0 translate-y-4 scale-95 pointer-events-none hidden"
      : "opacity-100 translate-y-0 scale-100 block"}
  `}>
      <DashOverview />
      </div>

      
      {/* Main Content */}
      <main className="space-y-6">
        {/* Active Splittz Section */}
        <section>
          <div className="flex justify-between items-center my-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Active Nearby Splitz
            </h2>
            <button className="text-green-600 text-sm font-medium hover:text-green-700">
              View All
            </button>
          </div>
          
          {/* Tab Filters */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            {tabFilters.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          {/* Splits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {splits.map((split) => (
              <div
                key={split.id}
                className="bg-[#F3F3F3] rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-1.5 border border-gray-100"
              >
                {/* Image Section */}
                <div className="relative">
                  <img
                    src={split.image}
                    alt={split.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  
                  {/* Badge */}
                  <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-3 py-1 rounded-full">
                    {split.badge}
                  </span>
                  
                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button 
                      className="bg-black/60 p-1.5 rounded-full hover:bg-white transition-all duration-200"
                      aria-label="Add to favorites"
                    >
                      <Heart size={16} className="text-white hover:text-red-500" />
                    </button>
                    <button 
                      className="bg-black/60 p-1.5 rounded-full hover:bg-white transition-all duration-200"
                      aria-label="Share"
                    >
                      <Share2 size={16} className="text-white hover:text-green-600" />
                    </button>
                  </div>
                </div>

                {/* Content Section */}
                <div className="space-y-2 p-3">
                  {/* Title and Status */}
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 flex-1 mr-2">
                      {split.title}
                    </h3>
                    <span 
                      className="text-xs px-2 py-1 rounded-full whitespace-nowrap"
                      style={{ 
                        backgroundColor: split.bgtext || '#E5F7E7',
                        color: split.textcolor || '#1F8225'
                      }}
                    >
                      {split.name}
                    </span>
                  </div>

                  {/* Price per person */}
                  <p className="text-sm text-gray-600">
                    <span className="text-[#1F8225] font-bold text-base">{split.price}</span>/person
                  </p>

                  {/* Details */}
                  <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-gray-200">
                    <div className="flex items-center gap-1">
                      <Users size={12} />
                      <span>{split.participants}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#E60000]">
                      <Clock size={12} />
                      <span>{split.timeLeft}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={12} className="text-[#1F8225]" />
                      <span>{split.distance}</span>
                    </div>
                  </div>

                  {/* CTA Section */}
                  <div className="flex items-center justify-between pt-3">
                    <div>
                      <span className="text-green-600 font-semibold text-lg">{split.price}</span>
                      <span className="text-xs text-gray-500 ml-1">total</span>
                    </div>
                    <button 
                      className="px-4 py-2 text-sm bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors duration-200"
                      onClick={() => console.log('Joining split:', split.id)}
                    >
                      Join Splitz
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Empty State (if no splits) */}
        {splits.length === 0 && (
          <div className="text-center py-10">
            <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
              <Users size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Active Splits Found</h3>
            <p className="text-gray-500 mb-4">There are currently no active splits in your area.</p>
            <button className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
              Create a Split
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Overview;