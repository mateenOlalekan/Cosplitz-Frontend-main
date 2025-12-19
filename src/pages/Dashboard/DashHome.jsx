import { useState } from "react";
import { Heart, Share2, Users, Clock, MapPin, Users2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Overlay1 from "../../assets/Overlay.svg";
import Overlay2 from "../../assets/Overlay1.svg";
import Overlay3 from "../../assets/Overlay2.svg";
import Overlay4 from "../../assets/Overlay3.svg";
import { splits, deals } from "../../Data/Alldata";

const Main = ({ sidebarOpen = false, isMobile = false, setSidebarOpen = () => {} }) => {
  const [activeTab, setActiveTab] = useState("All Active");

  const categories = [
    { icon: Overlay1, label: "Split Expenses" },
    { icon: Overlay2, label: "Bulk Orders & Riders" },
    { icon: Overlay3, label: "Borrow/Lend" },
    { icon: Overlay4, label: "Crowdfund" },
  ];

  const navigate = useNavigate();

  const CreateSplitz = () => {
    navigate("/dashboard/create-splitz");
  };

  return (
    <div className="w-full min-h-screen transition-all duration-300 px-4 ">
      <main className="space-y-3">
        {/* 🟩 Quick Access Categories */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 my-3">
            Quick Access Categories
          </h2>

          <div className="flex gap-5 md:gap-10 px-2 overflow-x-auto scrollbar-hide">
            {categories.map((cat, i) => (
              <button
                key={i}
                className="rounded-xl py-4  transition text-center"
              >
                <img src={cat.icon} alt={cat.label} className="w-15 h-15 mx-auto mb-2" />
                <p className="text-[10px] md:text-[12px] font-medium text-gray-900">{cat.label}</p>
              </button>
            ))}
          </div>
        </section>

        {/* 🟨 Special Deals */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-5">#SpecialForYou</h2>
          
          <div className="carousel carousel-end rounded-box gap-2 overflow-x-auto ">
            {deals.map((deal, idx) => (
              <div key={idx} className="carousel-item relative flex bg-[#1F8225] flex-col justify-between rounded-3xl overflow-hidden text-white shadow-lg hover:shadow-2xl transition-all duration-500 group h-fit ">                <div className={`absolute inset-0 opacity-90`} />

                <div className="relative z-10 p-3 flex flex-col justify-between h-full">
                  <div className="flex justify-between items-center">
                     <div className="bg-[#F8F8F8CC] rounded-xl py-1 text-sm px-4 text-[#1A051D]">deal.special</div>
                    {deal.discount && (
                      <span className="bg-[#DEF8D1] text-emerald-900 text-xs font-semibold px-3 py-1 rounded-full">
                        {deal.discount}
                      </span>
                    )}
                  </div>
               

                  <div className="my-4">
                    <h3 className="text-xl font-bold mb-1">{deal.title}</h3>
                    <p className="text-emerald-100 text-sm">{deal.description}</p>
                    <p className="text-emerald-100 text-xs mt-1">{deal.details}</p>
                  </div>

                  <div className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-4 text-xs text-white">
                      <span className="flex items-center gap-1">⏱ {deal.time}</span>
                      <span className="flex items-center gap-1">
                        <Users2 className="w-4 h-4" /> {deal.participants}
                      </span>
                    </div>

                    <button className="px-4 text-xs bg-[#FFF4D6] text-[#A37800] font-semibold py-2 rounded-lg transition">
                      Join Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 🟦 Create Splittz Banner */}
        <section>
          <div className="w-full bg-gradient-to-r from-[#096A0F] to-[#1F8225] px-4 py-6 rounded-lg 
              flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            {/* Text Section */}
            <div className="flex flex-col text-white">
              <h1 className="text-xl md:text-2xl font-semibold">
                Have something to share?
              </h1>
              <p className="text-sm md:text-base opacity-90">
                Start a splitz and find partners
              </p>
            </div>

            {/* Button */}
            <button
              onClick={CreateSplitz}
              className="bg-white text-[#096A0F] w-full sm:w-32 md:w-40 py-3 rounded-md 
                     text-base font-medium shadow sm:self-auto hover:bg-gray-50 transition"
            >
              Create Splitz
            </button>
          </div>
        </section>

        {/* 🟥 Active Splittz */}
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

          {/* Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {splits.map((split) => (
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
        </section>
      </main>
    </div>
  );
};

export default Main;