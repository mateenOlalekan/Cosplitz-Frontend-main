import React from 'react';
import { Shield, User, MapPin } from 'lucide-react';

export default function Verification() {
  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Verification Status</h2>
      </div>

      <div className="space-y-2">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Account Verification</h3>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              In Progress
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Shield size={16} className="text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Email Verification</h4>
                  <p className="text-sm text-gray-600">Your email is verified</p>
                </div>
              </div>
              <span className="text-green-600 font-medium">Verified</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Identity Verification</h4>
                  <p className="text-sm text-gray-600">Verify your identity document</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                Verify Now
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                  <MapPin size={16} className="text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Address Verification</h4>
                  <p className="text-sm text-gray-600">Verify your residential address</p>
                </div>
              </div>
              <span className="text-gray-500 font-medium">Pending</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}