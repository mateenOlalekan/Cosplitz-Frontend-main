import { useState } from "react";
import { Heart,  Share2,  Users,  Clock,  MapPin,  Users2,} from "lucide-react";
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
    navigate("/dashboard/create-split"); // correct way to navigate
  };

  return (
    <div className="w-full min-h-screen transition-all duration-300 px-4 ">
      <main className="space-y-3">

        {/* 🟩 Quick Access Categories */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Quick Access Categories
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {categories.map((cat, i) => (
              <button
                key={i}
                className="rounded-xl py-4 bg-white shadow-sm hover:shadow-md transition text-center"
              >
                <img src={cat.icon} alt={cat.label} className="w-10 h-10 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">{cat.label}</p>
              </button>
            ))}
          </div>
        </section>

        {/* 🟨 Special Deals */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-5">#SpecialForYou</h2>

          <div className="overflow-x-auto scrollbar-hide">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
              {deals.map((deal, idx) => (
                <div
                  key={idx}
                  className="relative flex flex-col justify-between rounded-3xl overflow-hidden text-white shadow-lg hover:shadow-2xl transition-all duration-500 group h-60"
                >
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />

                  <div className={`absolute inset-0 bg-gradient-to-br ${deal.color} opacity-90`} />

                  <div className="relative z-10 p-5 flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start">
                      <span className="bg-emerald-200 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
                        {deal.badge}
                      </span>

                      {deal.discount && (
                        <span className="bg-[#DEF8D1] text-emerald-900 text-xs font-semibold px-3 py-1 rounded-full">
                          {deal.discount}
                        </span>
                      )}
                    </div>

                    <div className="mt-6 mb-4">
                      <h3 className="text-xl font-bold mb-1">{deal.title}</h3>
                      <p className="text-emerald-100 text-sm">{deal.description}</p>
                      <p className="text-emerald-100 text-xs mt-1">{deal.details}</p>
                    </div>

                    <div className="flex justify-between items-center">
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
          </div>
        </section>

        {/* 🟦 Create Splittz Banner */}
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
           text-base font-medium shadow sm:self-auto"
  >
    Create Splitz
  </button>
</div>


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
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-3"
              >
                <div className="relative">
                  <img
                    src={split.image}
                    alt={split.title}
                    className="w-full h-40 sm:h-48 object-cover rounded-lg mb-3"
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

                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-gray-900">{split.title}</h3>
                  <span className={`${split.bgtext} text-xs px-2 py-1 rounded-full`}>
                    {split.name}
                  </span>
                </div>

                <p className="text-xs text-gray-500 mt-1 mb-2">
                  <MapPin className="inline-block w-3 h-3 mr-1" />
                  {split.distance} away
                </p>

                <div className="flex items-center justify-between text-xs text-gray-600">
                  <p className="flex items-center gap-1">
                    <Users size={12} /> {split.participants}
                  </p>
                  <p className="flex items-center gap-1">
                    <Clock size={12} /> {split.timeLeft}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <p className="text-green-600 font-semibold">{split.price}</p>
                  <button className="text-sm text-green-600 hover:underline">
                    Join
                  </button>
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
