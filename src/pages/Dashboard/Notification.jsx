import React, { useState } from 'react';
import { Home, FileText, MessageCircle, Wallet, MapPin, BarChart3, Bell, Settings, X, Search, Menu } from 'lucide-react';

export default function CosplitzNotifications() {
  const [activeTab, setActiveTab] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications] = useState([
    {
      id: 1,
      type: 'join',
      message: 'Sarah Kelvin joined your Shared Taxi to Campus splittz',
      date: '10/16/2025',
      time: '10:00pm',
      status: null
    },
    {
      id: 2,
      type: 'join',
      message: 'You successfully joined The Concert Ticket Group splittz',
      date: '10/16/2025',
      time: '10:00pm',
      status: null
    },
    {
      id: 3,
      type: 'payment',
      message: 'Payment successful',
      amount: '₦2,000',
      date: '10/16/2025',
      time: '10:00pm',
      status: 'successful'
    },
    {
      id: 4,
      type: 'payment',
      message: 'Payment failed',
      date: '10/16/2025',
      time: '10:00pm',
      status: 'failed'
    },
    {
      id: 5,
      type: 'join',
      message: 'Sarah Kelvin joined your Shared Taxi to Campus splittz',
      date: '10/16/2025',
      time: '10:00pm',
      status: null
    },
    {
      id: 6,
      type: 'join',
      message: 'You successfully joined The Concert Ticket Group splittz',
      date: '10/16/2025',
      time: '10:00pm',
      status: null
    },
    {
      id: 7,
      type: 'payment',
      message: 'Payment successful',
      amount: '₦2,000',
      date: '10/16/2025',
      time: '10:00pm',
      status: 'successful'
    },
    {
      id: 8,
      type: 'payment',
      message: 'Payment failed',
      date: '10/16/2025',
      time: '10:00pm',
      status: 'failed'
    }
  ]);



  const tabs = [
    { id: 'all', label: 'All', count: 60 },
    { id: 'unread', label: 'Unread', count: 0 },
    { id: 'read', label: 'Read', count: 0 }
  ];

  return (
    <div className="flex h-screen">

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">


        {/* Notifications Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-1">
            {/* Title & Search */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Notification</h1>
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-green-500">
                <Search size={18} className="text-gray-400" />
                <input type="text" placeholder="Search" className="outline-none text-sm flex-1" />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
                    activeTab === tab.id
                      ? 'border-green-600 text-green-600'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
              {notifications.map(notif => (
                <div
                  key={notif.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-gray-900 rounded-full flex-shrink-0 mt-1"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-800 text-sm font-medium leading-relaxed break-words">
                          {notif.message}
                          {notif.amount && <span className="font-semibold"> {notif.amount}</span>}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      {notif.status && (
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          notif.status === 'successful'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {notif.status.charAt(0).toUpperCase() + notif.status.slice(1)}
                        </span>
                      )}
                      <div className="text-right">
                        <div className="text-xs text-gray-500">{notif.date}</div>
                        <div className="text-xs text-gray-500">{notif.time}</div>
                      </div>
                      <button className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded transition-all">
                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="5" r="2" />
                          <circle cx="12" cy="12" r="2" />
                          <circle cx="12" cy="19" r="2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* See More Button */}
            <div className="text-center mt-8">
              <button className="bg-green-100 text-green-700 font-medium px-6 py-2 rounded-lg hover:bg-green-200 transition-all">
                See more
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}