import { Check, X } from "lucide-react";

export default function PasswordValidation({ password }) {
  const validations = [
    { label: "8+ characters", isValid: password.length >= 8 },
    { label: "Uppercase letter (A–Z)", isValid: /[A-Z]/.test(password) },
    { label: "Digit (0–9)", isValid: /\d/.test(password) },
  ];

  return (
    <div className="flex flex-col gap-2 mt-2">
      {validations.map((rule, index) => (
        <div key={index} className="flex items-center gap-3">
          
          {/* Icon indicator */}
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
              rule.isValid ? "bg-green-100" : "bg-gray-200"
            }`}
          >
            {rule.isValid ? (
              <Check size={14} className="text-green-600" />
            ) : (
              <X size={14} className="text-gray-500" />
            )}
          </div>

          {/* Label */}
          <span
            className={`text-xs ${
              rule.isValid ? "text-green-600 font-medium" : "text-gray-500"
            }`}
          >
            {rule.label}
          </span>

        </div>
      ))}
    </div>
  );
}
