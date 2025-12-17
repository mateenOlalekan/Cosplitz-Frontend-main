import React, { useState } from 'react'; 
import { Search, CircleX, Filter } from 'lucide-react';
import Avatar from '../../assets/Avatar.svg';

export default function CosplitzNotifications() {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications] = useState([
    { id: 1, type: 'join', message: 'Sarah Kelvin joined your Shared Taxi to Campus splittz', date: '10/16/2025', time: '10:00pm', status: null },
    { id: 2, type: 'join', message: 'You successfully joined The Concert Ticket Group splittz', date: '10/16/2025', time: '10:00pm', status: null },
    { id: 3, type: 'payment', message: 'Payment successful', amount: '₦2,000', date: '10/16/2025', time: '10:00pm', status: 'successful' },
    { id: 4, type: 'payment', message: 'Payment failed', date: '10/16/2025', time: '10:00pm', status: 'failed' },
    { id: 5, type: 'join', message: 'Sarah Kelvin joined your Shared Taxi to Campus splittz', date: '10/16/2025', time: '10:00pm', status: null },
    { id: 6, type: 'join', message: 'You successfully joined The Concert Ticket Group splittz', date: '10/16/2025', time: '10:00pm', status: null },
    { id: 7, type: 'payment', message: 'Payment successful', amount: '₦2,000', date: '10/16/2025', time: '10:00pm', status: 'successful' },
    { id: 8, type: 'payment', message: 'Payment failed', date: '10/16/2025', time: '10:00pm', status: 'failed' }
  ]);

  const tabs = [
    { id: 'all', label: 'All', count: 60 },
    { id: 'unread', label: 'Unread', count: 0 },
    { id: 'read', label: 'Read', count: 0 }
  ];

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-gray-50">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="max-w-screen-2xl ">
          
          {/* Top Bar */}
          <div className='flex justify-between items-center bg-white mb-4 p-4 rounded-lg shadow-sm'>
            <CircleX size={24} className="cursor-pointer" />
            <span className='font-semibold text-lg sm:text-xl'>Notifications</span>
            <div className="w-6"></div> {/* placeholder to balance flex */}
          </div>

          {/* Header & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              Notifications
            </h1>
            <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto'>
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 sm:px-4 py-2 flex-1 focus-within:ring-2 focus-within:ring-green-500">
                <Search size={18} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="outline-none text-sm sm:text-base flex-1"
                />
              </div>
              <Filter size={28} className="cursor-pointer border border-gray-200 rounded-lg p-1" />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-4 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 px-3 sm:px-4 py-2 text-sm sm:text-base font-medium whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-1 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="space-y-2">
            {notifications.map(notif => (
              <div
                key={notif.id}
                className="bg-[#ECE9F1] border border-gray-200 p-3.5 hover:shadow-md hover:border-gray-300 rounded-lg transition-all cursor-pointer group"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  
                  {/* Message */}
                  <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                    <img src={Avatar} alt="Avatar" className="w-10 h-10 rounded-full flex-shrink-0 mt-1 sm:mt-0" />
                    <p className="text-gray-800 text-sm sm:text-base font-medium leading-relaxed break-words flex-1">
                      {notif.message}
                      {notif.amount && <span className="font-semibold"> {notif.amount}</span>}
                    </p>
                  </div>

                  {/* Meta & Actions */}
                  <div className="flex sm:items-end gap-2 flex-shrink-0 text-right mt-2 sm:mt-0">
                    {notif.status && (
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          notif.status === 'successful'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {notif.status.charAt(0).toUpperCase() + notif.status.slice(1)}
                      </span>
                    )}
                    <div className="text-xs text-gray-500">
                      <div>{notif.date}</div>
                      <div>{notif.time}</div>
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded transition-all">
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
          <div className="text-center mt-6">
            <button className="bg-green-100 text-green-700 font-medium px-6 py-2 rounded-lg hover:bg-green-200 transition-all">
              See more
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
