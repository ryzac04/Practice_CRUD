import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ApiErrorPayload } from "../types/user";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ emailOrUsername: "", password: "" });
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setLoading(true);
    try {
      // Backend accepts username OR email. Both keys are passed, one may be empty. 
      const body =
        form.emailOrUsername.includes("@")
          ? { email: form.emailOrUsername, password: form.password }
          : { username: form.emailOrUsername, password: form.password };

      await login(body);
      nav("/users");
    } catch (err: any) {
      const payload: ApiErrorPayload | undefined = err?.response?.data?.error;
      setServerError(
        (typeof payload?.message === "string" && payload.message) || "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 360, display: "grid", gap: 12 }}>
      <h2>Login</h2>

      <label>
        Email or Username
        <input
          name="emailOrUsername"
          value={form.emailOrUsername}
          onChange={onChange}
          required
        />
      </label>

      <label>
        Password
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          required
        />
      </label>

      {serverError && <div style={{ color: "crimson" }}>{serverError}</div>}
      <button disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
    </form>
  )
};