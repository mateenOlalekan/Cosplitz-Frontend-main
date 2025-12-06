// src/pages/NotFoundPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  RefreshCw,
  Mail,
  AlertTriangle,
  Search,
} from "lucide-react"; // Lucide icons

const NotFoundPage = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleReportIssue = () => {
    console.log("Opening issue reporter...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 text-center">
        {/* Animated 404 Number */}
        <div className="relative">
          <h1 className="text-9xl font-bold text-gray-900 opacity-10">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl sm:text-8xl font-bold text-indigo-600 animate-pulse">
              404
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 sm:p-12 border border-white/20">
          {/* Error Icon */}
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 mb-6">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
            Page Not Found
          </h2>

          <p className="text-xl text-gray-600 mb-2">
            Oops! The page you're looking for has vanished into the digital
            void.
          </p>

          <p className="text-lg text-gray-500 mb-8">
            It might have been moved, deleted, or you entered the wrong URL.
          </p>

          {/* Suggested Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-600 font-semibold mb-2">1. Check URL</div>
              <p className="text-sm text-blue-500">
                Ensure the address is spelled correctly
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-green-600 font-semibold mb-2">2. Go Home</div>
              <p className="text-sm text-green-500">Navigate back to safety</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-purple-600 font-semibold mb-2">
                3. Report Issue
              </div>
              <p className="text-sm text-purple-500">
                Tell us about the problem
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              <Home className="h-5 w-5 mr-2" />
              Back to Homepage
            </Link>

            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Refresh Page
            </button>

            <button
              onClick={handleReportIssue}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              <Mail className="h-5 w-5 mr-2" />
              Report Issue
            </button>
          </div>

          {/* Search Suggestion */}
          <div className="mt-8">
            <p className="text-gray-500 mb-4">Try searching for what you need:</p>
            <div className="max-w-md mx-auto">
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 py-3 border-gray-300 rounded-lg"
                  placeholder="Search our site..."
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Help */}
        <div className="text-center text-gray-500">
          <p className="mb-4">Need immediate assistance?</p>
          <div className="flex justify-center space-x-6">
            <a
              href="/contact"
              className="text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
            >
              Contact Support
            </a>
            <a
              href="/help"
              className="text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
            >
              Help Center
            </a>
            <a
              href="/sitemap"
              className="text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
            >
              Site Map
            </a>
          </div>
        </div>

        {/* Development Details */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <details className="text-left">
              <summary className="cursor-pointer font-medium text-yellow-800">
                Development Details
              </summary>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Current URL: {window.location.href}</p>
                <p>Pathname: {window.location.pathname}</p>
                <p>Timestamp: {new Date().toISOString()}</p>
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotFoundPage;
