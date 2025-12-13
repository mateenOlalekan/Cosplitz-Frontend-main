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

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl text-center font-bold text-gray-900">
        Create Your Account
      </h1>
      <p className="text-gray-500 text-center text-sm mt-1 mb-4">
        Let's get started with real-time cost sharing.
      </p>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg mb-3 text-center">
          {error}
        </div>
      )}

      {/* Social Signup */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSocialRegister("google")}
          className="flex items-center justify-center gap-3 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <FcGoogle size={20} />
          <span className="text-gray-700 text-sm">Sign Up with Google</span>
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSocialRegister("apple")}
          className="flex items-center justify-center gap-3 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <PiAppleLogoBold size={20} />
          <span className="text-gray-700 text-sm">Sign Up with Apple</span>
        </motion.button>
      </div>

      {/* Divider */}
      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-300" />
        <span className="mx-2 text-gray-500 text-sm">Or</span>
        <div className="flex-grow border-t border-gray-300" />
      </div>

      {/* Form */}
      <form onSubmit={handleFormSubmit} className="space-y-3">
        {[
          { key: "firstName", label: "First Name", type: "text" },
          { key: "lastName", label: "Last Name", type: "text" },
          { key: "email", label: "Email Address", type: "email" },
          { key: "nationality", label: "Nationality", type: "text" },
        ].map((field) => (
          <div key={field.key}>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              {field.label} *
            </label>
            <input
              type={field.type}
              value={formData[field.key]}
              onChange={(e) =>
                handleInputChange(field.key, e.target.value)
              }
              placeholder={`Enter your ${field.label.toLowerCase()}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-colors"
              required
            />
          </div>
        ))}

        {/* Password */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            Password *
          </label>

          <div className="flex items-center border border-gray-300 px-3 rounded-lg focus-within:ring-2 focus-within:ring-green-500 transition-colors">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                handleInputChange("password", e.target.value)
              }
              placeholder="Create your password"
              className="w-full py-2 outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="text-gray-400 hover:text-gray-600 ml-2"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <PasswordValidation password={formData.password} />
        </div>

        {/* Terms */}
        <label className="flex gap-2 text-sm text-gray-600 mt-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={(e) =>
              handleInputChange("agreeToTerms", e.target.checked)
            }
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

        {/* Submit */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          className={`w-full bg-green-600 text-white py-3 rounded-lg font-semibold transition-all ${
            loading ? "opacity-60 cursor-not-allowed" : "hover:bg-green-700"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creating Account...
            </span>
          ) : (
            "Create Account"
          )}
        </motion.button>

        {/* Login link */}
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
