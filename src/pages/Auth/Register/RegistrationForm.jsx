// src/pages/RegistrationForm.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { PiAppleLogoBold } from "react-icons/pi";
import { Eye, EyeOff } from "lucide-react";
import PasswordValidation from "./PasswordValidation";

function RegistrationForm({
  formData,
  handleInputChange,
  handleFormSubmit,
  handleSocialRegister,
  loading,
  error,
}) {
  const [showPassword, setShowPassword] = useState(false);
  
  // Common nationalities - you can expand this list
  const nationalities = [
    "Nigeria", "Ghana", "Kenya", "South Africa", "Egypt", "Morocco",
    "United States", "Canada", "United Kingdom", "Germany", "France",
    "India", "China", "Japan", "Australia", "Brazil", "Mexico"
  ];

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              First Name *
            </label>
            <input
              type="text"
              value={formData.firstName}
              placeholder="Enter your first name"
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Last Name *
            </label>
            <input
              type="text"
              value={formData.lastName}
              placeholder="Enter your last name"
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-colors"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email}
            placeholder="Enter your email address"
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-colors"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Nationality
          </label>
          <select
            value={formData.nationality}
            onChange={(e) => handleInputChange("nationality", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-colors bg-white"
          >
            <option value="">Select your nationality</option>
            {nationalities.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
          {formData.nationality === "Other" && (
            <input
              type="text"
              placeholder="Please specify your nationality"
              onChange={(e) => handleInputChange("nationality", e.target.value)}
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-colors"
            />
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            Password *
          </label>
          <div className="flex items-center border border-gray-300 px-3 rounded-lg focus-within:ring-2 focus-within:ring-green-500 transition-colors">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              placeholder="Create your password (min. 8 chars, 1 uppercase, 1 number)"
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="w-full py-2 outline-none"
              required
              minLength={8}
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

        <label className="flex gap-2 text-sm text-gray-600 mt-2 cursor-pointer items-start">
          <input
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
            className="rounded focus:ring-green-500 mt-1"
          />
          <span>
            I agree to the{" "}
            <a href="/terms" className="text-green-600 hover:underline font-medium" target="_blank" rel="noopener noreferrer">
              Terms
            </a>
            ,{" "}
            <a href="/privacy" className="text-green-600 hover:underline font-medium" target="_blank" rel="noopener noreferrer">
              Privacy
            </a>{" "}
            &{" "}
            <a href="/fees" className="text-green-600 hover:underline font-medium" target="_blank" rel="noopener noreferrer">
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