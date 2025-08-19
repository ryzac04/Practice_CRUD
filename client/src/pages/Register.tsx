import { useState } from "react";
import { registerApi } from "../api/auth";
import type { ApiErrorPayload } from "../types/user";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();
  // Component-local state for form inputs
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setServerError(null);
    try {
      // call backend 
      await registerApi(form);
      nav("/login");
    } catch (err: any) {
      // Try to extract standardized error from backend
      const payload: ApiErrorPayload | undefined = err?.response?.data?.error;
      setServerError(
        (typeof payload?.message === "string" && payload.message) ||
        // Marshmallow may return a dict of field errors
        (payload?.message && JSON.stringify(payload.message)) ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 360, display: "grid", gap: 12 }}>
      <h2 className="text-white text-2xl">Register</h2>

      <label className="text-white">
        <span className="mr-2">Username:</span>
        <input
          name="username"
          value={form.username}
          onChange={onChange}
          required minLength={3}
          className="border border-white text-white" />
      </label>

      <label className="text-white">
        <span className="mr-2">Email:</span>
        <input
          name="email"
          value={form.email}
          onChange={onChange}
          required className="border border-white text-white" />
      </label>

      <label className="text-white">
        <span className="mr-2">Password:</span>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          required
          className="border border-white text-white"
        />
      </label>

      {serverError && <div style={{ color: "crimson" }}>{serverError}</div>}

      <button disabled={loading} className="text-white border border-white hover:cursor-pointer">{loading ? "Creating.." : "Create Account"}</button>
    </form>
  )
};