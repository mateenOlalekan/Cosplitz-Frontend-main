import {
  ChevronDown,
  Bell,
  Settings,
  MapPin,
  ListFilter,
  Search,
} from "lucide-react";
import { useState } from "react";
import screen from "../../assets/screen.svg";
import { useNavigate, Link } from "react-router-dom";

function MySplitz() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const allfiter = ["All", "Active", "Success", "Failed"];

  // Dummy data
  const dummyData = [
    {
      id: 1,
      splitzName: "Weekend Trip to Lagos",
      role: "Creator",
      status: "Active",
      progress: 65,
      participants: 8,
      totalAmount: 500000,
      collectedAmount: 325000,
      createdDate: "2024-01-15",
      deadline: "2024-02-15"
    },
    {
      id: 2,
      splitzName: "Office Party",
      role: "Participant",
      status: "Success",
      progress: 100,
      participants: 15,
      totalAmount: 300000,
      collectedAmount: 300000,
      createdDate: "2023-12-10",
      completedDate: "2024-01-10"
    },
    {
      id: 3,
      splitzName: "Birthday Gift for John",
      role: "Creator",
      status: "Failed",
      progress: 40,
      participants: 5,
      totalAmount: 150000,
      collectedAmount: 60000,
      createdDate: "2024-01-20",
      deadline: "2024-02-05"
    },
    {
      id: 4,
      splitzName: "Monthly Groceries",
      role: "Participant",
      status: "Active",
      progress: 85,
      participants: 4,
      totalAmount: 80000,
      collectedAmount: 68000,
      createdDate: "2024-01-25",
      deadline: "2024-02-10"
    },
    {
      id: 5,
      splitzName: "New Year Celebration",
      role: "Creator",
      status: "Success",
      progress: 100,
      participants: 20,
      totalAmount: 1000000,
      collectedAmount: 1000000,
      createdDate: "2023-12-20",
      completedDate: "2024-01-05"
    },
    {
      id: 6,
      splitzName: "Team Lunch",
      role: "Participant",
      status: "Active",
      progress: 75,
      participants: 12,
      totalAmount: 240000,
      collectedAmount: 180000,
      createdDate: "2024-01-18",
      deadline: "2024-02-18"
    },
    {
      id: 7,
      splitzName: "Project Contribution",
      role: "Creator",
      status: "Failed",
      progress: 30,
      participants: 6,
      totalAmount: 180000,
      collectedAmount: 54000,
      createdDate: "2024-01-05",
      deadline: "2024-01-30"
    },
    {
      id: 8,
      splitzName: "Conference Fees",
      role: "Participant",
      status: "Success",
      progress: 100,
      participants: 8,
      totalAmount: 400000,
      collectedAmount: 400000,
      createdDate: "2023-11-15",
      completedDate: "2023-12-15"
    }
  ];

  // Filter counts calculation
  const filterCounts = {
    All: dummyData.length,
    Active: dummyData.filter(item => item.status === "Active").length,
    Success: dummyData.filter(item => item.status === "Success").length,
    Failed: dummyData.filter(item => item.status === "Failed").length
  };

  // Filter and search data
  const filteredData = dummyData.filter(item => {
    // Apply status filter
    const statusMatch = filter === "All" || item.status === filter;
    
    // Apply search filter
    const searchMatch = searchQuery === "" || 
      item.splitzName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  const goCreateSplitz = () => {
    navigate("/dashboard/create-splitz");
  };

  // View details handler
  const handleViewDetails = (id) => {
    navigate(`/dashboard/splitz-details/${id}`);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="w-full flex items-center justify-between py-3 px-4 md:px-6 bg-white shadow-sm">
        <div className="flex items-center gap-1 text-[#67707E]">
          <MapPin size={16} />
          <span className="text-sm font-medium">
            Ikeja, Lagos, Nigeria
          </span>
          <ChevronDown size={16} />
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/dashboard/notification"
            className="relative p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Bell size={18} className="text-[#67707E]" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          </Link>

          <Link
            to="/dashboard/settings"
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Settings size={18} className="text-[#67707E]" />
          </Link>
        </div>
      </div>

      {/* Page Title */}
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-800">
            My Splitz
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Check your splitz history
          </p>
        </div>

        <button className="flex items-center gap-1 px-3 py-2 border border-gray-300 text-sm rounded-md hover:bg-gray-50 transition">
          This month
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-6 md:space-x-8 px-4 md:px-6 overflow-x-auto">
          {allfiter.map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`flex-shrink-0 pb-3 relative ${
                filter === item
                  ? 'text-green-700 border-b-2 border-green-700 font-semibold'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="text-sm md:text-base">
                {item} ({filterCounts[item]})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center justify-end gap-2 px-4 md:px-6 mt-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for your splitz..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
        </div>

        <button
          className="h-10 w-10 flex items-center justify-center border border-gray-300 rounded-lg text-[#67707E] hover:bg-green-600 hover:text-white hover:border-green-600 transition"
          aria-label="Filter"
        >
          <ListFilter size={18} />
        </button>
      </div>

      {/* Table */}
      <div className="px-4 md:px-6 mt-6 flex-1">
        {filteredData.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F7F5F9]">
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700">Splitz name</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700">Role</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700">Progress</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{item.splitzName}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {formatCurrency(item.totalAmount)} • {item.participants} participants
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.role === 'Creator' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.role}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : item.status === 'Success'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="w-32">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{item.progress}%</span>
                            <span className="text-xs text-gray-500">
                              {formatCurrency(item.collectedAmount)}/{formatCurrency(item.totalAmount)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                item.progress === 100 
                                  ? 'bg-green-600' 
                                  : item.progress > 70 
                                  ? 'bg-blue-600' 
                                  : item.progress > 40 
                                  ? 'bg-yellow-500' 
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleViewDetails(item.id)}
                          className="px-4 py-2 text-sm font-medium text-green-700 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          // Empty State
          <div className="flex flex-1 items-center justify-center px-4 py-12">
            <div className="max-w-md w-full text-center">
              <img
                src={screen}
                alt="analytics"
                className="mx-auto max-h-48 object-contain"
              />

              <h1 className="mt-4 font-bold text-lg text-[#67707E]/40">
                {searchQuery ? 'No splitz found' : 'You haven\'t created or joined any splitz yet'}
              </h1>
              <p className="mt-2 text-sm text-[#67707E]/60">
                {searchQuery 
                  ? 'Try adjusting your search or filter to find what you\'re looking for.'
                  : 'Splitz you create or join will appear here for easy tracking and updates.'
                }
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={goCreateSplitz}
                  className="flex-1 bg-[#1F8225] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition active:scale-95"
                >
                  Create a splitz
                </button>

                <button className="flex-1 border border-green-600 text-green-700 py-2.5 rounded-lg text-sm font-medium hover:bg-green-50 transition active:scale-95">
                  Join Splitz
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pagination (if needed) */}
        {filteredData.length > 0 && (
          <div className="flex items-center justify-between px-4 py-4 border-t border-gray-200 bg-white">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{filteredData.length}</span> of <span className="font-medium">{dummyData.length}</span> results
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded bg-green-50 text-green-700 border-green-600">
                1
              </button>
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MySplitz;