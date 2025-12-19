// src/pages/RegistrationForm.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { PiAppleLogoBold } from "react-icons/pi";
import { Eye, EyeOff, Search, ChevronDown } from "lucide-react";
import PasswordValidation from "./PasswordValidation";
import { fetchCountries, getAllCountries } from "../../../services/countryService";
import debounce from "lodash/debounce"; // Install with: npm install lodash

function RegistrationForm({
  formData,
  handleInputChange,
  handleFormSubmit,
  handleSocialRegister,
  loading,
  error,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [nationalitySuggestions, setNationalitySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const wrapperRef = useRef(null);
  
  // Load initial countries on component mount
  useEffect(() => {
    const loadInitialCountries = async () => {
      setIsLoadingCountries(true);
      const countries = await getAllCountries();
      setNationalitySuggestions(countries);
      setIsLoadingCountries(false);
    };
    
    loadInitialCountries();
  }, []);
  
  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        const countries = await getAllCountries();
        setNationalitySuggestions(countries);
        return;
      }
      
      setIsLoadingCountries(true);
      const countries = await fetchCountries(query);
      setNationalitySuggestions(countries);
      setIsLoadingCountries(false);
    }, 300),
    []
  );
  
  // Handle nationality input change
  const handleNationalityChange = (value) => {
    setSearchQuery(value);
    handleInputChange("nationality", value);
    setShowSuggestions(true);
    debouncedSearch(value);
  };
  
  // Handle suggestion selection
  const handleSuggestionSelect = (countryName) => {
    handleInputChange("nationality", countryName);
    setSearchQuery(countryName);
    setShowSuggestions(false);
  };
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Handle key events for accessibility
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl text-center font-bold text-gray-900">
        Create Your Account
      </h1>
      <p className="text-gray-500 text-center text-sm mt-1 mb-4">
        Let's get started with real-time cost sharing.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg mb-3 text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => handleSocialRegister("google")}
          className="flex items-center justify-center gap-3 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <FcGoogle size={20} />
          <span className="text-gray-700 text-sm">Sign Up with Google</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => handleSocialRegister("apple")}
          className="flex items-center justify-center gap-3 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <PiAppleLogoBold size={20} />
          <span className="text-gray-700 text-sm">Sign Up with Apple</span>
        </motion.button>
      </div>

      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-2 text-gray-500 text-sm">Or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-3">
        {[
          { key: "firstName", label: "First Name", type: "text" },
          { key: "lastName", label: "Last Name", type: "text" },
          { key: "email", label: "Email Address", type: "email" },
        ].map((field) => (
          <div key={field.key}>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              {field.label} *
            </label>
            <input
              type={field.type}
              value={formData[field.key]}
              placeholder={`Enter your ${field.label.toLowerCase()}`}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-colors"
              required
            />
          </div>
        ))}

        {/* Nationality Field with Autocomplete */}
        <div ref={wrapperRef}>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Nationality *
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleNationalityChange(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              placeholder="Start typing to search for your country"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-colors"
              required
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {isLoadingCountries ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <ChevronDown size={18} className="text-gray-400" />
              )}
            </div>
            
            {/* Suggestions Dropdown */}
            {showSuggestions && nationalitySuggestions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <div className="px-3 py-2 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center text-gray-500 text-sm">
                    <Search size={14} className="mr-2" />
                    <span>Select your country</span>
                  </div>
                </div>
                {nationalitySuggestions.map((country) => (
                  <div
                    key={country.code}
                    className="px-3 py-2 hover:bg-green-50 cursor-pointer transition-colors"
                    onClick={() => handleSuggestionSelect(country.name)}
                  >
                    <div className="flex items-center">
                      <span className="text-gray-800">{country.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* No Results State */}
            {showSuggestions && searchQuery && nationalitySuggestions.length === 0 && !isLoadingCountries && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                <div className="px-3 py-4 text-center text-gray-500">
                  No countries found for "{searchQuery}"
                </div>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Type to search and select your nationality from the list
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            Password *
          </label>
          <div className="flex items-center border border-gray-300 px-3 rounded-lg focus-within:ring-2 focus-within:ring-green-500 transition-colors">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              placeholder="Create your password"
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="w-full py-2 outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <PasswordValidation password={formData.password} />
        </div>

        <label className="flex gap-2 text-sm text-gray-600 mt-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
            className="rounded focus:ring-green-500"
          />
          <span>
            I agree to the{" "}
            <a href="/terms" className="text-green-600 hover:underline font-medium">
              Terms
            </a>
            ,{" "}
            <a href="/privacy" className="text-green-600 hover:underline font-medium">
              Privacy
            </a>{" "}
            &{" "}
            <a href="/fees" className="text-green-600 hover:underline font-medium">
              Fees
            </a>
            .
          </span>
        </label>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className={`w-full bg-green-600 text-white py-3 rounded-lg font-semibold transition-all duration-200 ${
            loading ? "opacity-60 cursor-not-allowed" : "hover:bg-green-700"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Creating Account...
            </span>
          ) : (
            "Create Account"
          )}
        </motion.button>

        <p className="text-center text-sm text-gray-600 mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 hover:underline font-medium">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegistrationForm;