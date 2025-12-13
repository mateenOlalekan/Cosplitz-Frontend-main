import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function RegistrationForm({ onSubmit, loading, error }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    nationality: "",
    password: "",
    agree: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Create Account</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-2 text-sm rounded">
          {error}
        </div>
      )}

      {["first_name", "last_name", "email", "nationality"].map((f) => (
        <input
          key={f}
          required
          type={f === "email" ? "email" : "text"}
          placeholder={f.replace("_", " ")}
          value={form[f]}
          onChange={(e) => update(f, e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />
      ))}

      <div className="flex items-center border rounded-lg px-3">
        <input
          required
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          className="w-full py-2 outline-none"
        />
        <button
          type="button"
          onClick={() => setShowPassword((s) => !s)}
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </button>
      </div>

      <label className="flex gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.agree}
          onChange={(e) => update("agree", e.target.checked)}
        />
        I agree to the terms
      </label>

      <button
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 rounded-lg"
      >
        {loading ? "Creating..." : "Create Account"}
      </button>
    </form>
  );
}
