import React, { useState } from 'react';
import { Edit2 } from 'lucide-react';

export default function MyProfile() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationalId: '',
    nationality: '',
    city: '',
    district: '',
    address: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
  };

  return (
    <div className="h-full w-full overflow-y-auto p-3">
      
      {/* ===== Header ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4  gap-3">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
          Profile Information
        </h2>
        <button className="flex items-center gap-2 px-3 sm:px-4 py-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
          <Edit2 size={16} />
          <span className="text-sm sm:text-base font-medium">Edit</span>
        </button>
      </div>

      {/* ===== Profile Card ===== */}
      <div className="rounded-lg my-3">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex-shrink-0"></div>
          <div className="text-center sm:text-left">
            <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900">
              Alice Badmus
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">View Profiles & Settings</p>
          </div>
        </div>
      </div>

      {/* ===== Personal Details Form ===== */}
      <form onSubmit={handleSubmit} className="space-y-2">
        
        {/* Personal Details Section */}
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Personal Details</h3>
          
          {/* Row 1: First Name & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
            {['firstName', 'lastName', 'email', 'phone', 'nationalId'].map((field, idx) => (
              <div key={idx}>
                <label className="block text-sm sm:text-base font-medium text-gray-900 mb-1">
                  {field === 'firstName' ? 'First Name' :
                   field === 'lastName' ? 'Last Name' :
                   field === 'email' ? 'Email address' :
                   field === 'phone' ? 'Phone number' : 'National identity number'}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  placeholder={`Enter your ${field === 'nationalId' ? 'national identity number' : field}`}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder:text-gray-400"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Address Section */}
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Address</h3>
          
          {/* Row 1: Nationality & City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
            {['nationality', 'city'].map((field, idx) => (
              <div key={idx}>
                <label className="block text-sm sm:text-base font-medium text-gray-900 mb-1">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                  {field === 'nationality' && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  placeholder={`Enter your ${field}`}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder:text-gray-400"
                />
              </div>
            ))}
          </div>

          {/* Row 2: District & Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {['district', 'address'].map((field, idx) => (
              <div key={idx}>
                <label className="block text-sm sm:text-base font-medium text-gray-900 mb-1">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  placeholder={`Enter your ${field}`}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder:text-gray-400"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
          <button
            type="button"
            className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg text-gray-900 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            Save changes
          </button>
        </div>

      </form>
    </div>
  );
}
