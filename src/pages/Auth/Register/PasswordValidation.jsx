// src/pages/Auth/Register/PasswordValidation.jsx
import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

const PasswordValidation = ({ password }) => {
  const validations = [
    {
      label: "At least 8 characters",
      isValid: password.length >= 8,
    },
    {
      label: "Contains uppercase letter",
      isValid: /[A-Z]/.test(password),
    },
    {
      label: "Contains a number",
      isValid: /\d/.test(password),
    },
  ];

  return (
    <div className="mt-2 space-y-1">
      {validations.map((validation, index) => (
        <div key={index} className="flex items-center gap-2">
          {validation.isValid ? (
            <CheckCircle size={14} className="text-green-500" />
          ) : (
            <XCircle size={14} className="text-gray-300" />
          )}
          <span
            className={`text-xs ${
              validation.isValid ? "text-green-600" : "text-gray-400"
            }`}
          >
            {validation.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default PasswordValidation;