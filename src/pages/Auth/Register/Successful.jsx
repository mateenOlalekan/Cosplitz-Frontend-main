// src/pages/Successful.jsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Checknow from "../../../assets/Check.svg"; // Fixed the typo from 'Checknow'

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
        onClick={() => navigate("/onb")}
        className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
      >
        Continue to Login
      </motion.button>
    </div>
  );
}

export default Successful;