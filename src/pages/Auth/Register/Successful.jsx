import React from 'react'
import { motion } from "framer-motion";
import Checknow from "../../assets/Check.svg";
import { useNavigate } from "react-router-dom"; 


function Successful() {
    const navigate = useNavigate();
    
  return (
              <div className="flex flex-col items-center text-center py-6">
                <img src={Checknow} alt="Success" className="w-24 h-24 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Email Verified!
                </h2>
                <p className="text-gray-600 mt-2 max-w-sm">
                  Your email has been successfully verified. You can now log in to your account.
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/login")}
                  className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Continue to Login
                </motion.button>
                <p className="text-sm text-gray-500 mt-3">
                  Didn't receive the email?{" "}
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="text-green-600 hover:underline font-medium"
                  >
                    Go back to verification
                  </button>
                </p>
              </div>
  )
}

export default Successful