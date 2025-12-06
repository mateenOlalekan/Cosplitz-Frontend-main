import React from 'react';
import { Headphones, FileText } from 'lucide-react';

export default function Support() {
  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Support</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Headphones size={24} className="text-blue-500" />
            <h3 className="text-lg font-bold text-gray-900">Contact Support</h3>
          </div>
          <p className="text-gray-600 mb-4">Get help from our support team</p>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Email: support@cosplitz.com</p>
            <p className="text-sm text-gray-600">Phone: +1 (555) 123-4567</p>
            <p className="text-sm text-gray-600">Hours: 24/7</p>
          </div>
          <button className="w-full mt-4 px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
            Contact Now
          </button>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <FileText size={24} className="text-green-500" />
            <h3 className="text-lg font-bold text-gray-900">Help Center</h3>
          </div>
          <p className="text-gray-600 mb-4">Find answers to common questions</p>
          <div className="space-y-3">
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              How to create a group?
            </button>
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Payment issues
            </button>
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Account security
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Submit a Request</h3>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Subject</label>
            <input
              type="text"
              placeholder="Enter subject"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
            <textarea
              rows={4}
              placeholder="Describe your issue"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
            ></textarea>
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}