/**
 * Supabase Auth Emulator
 * Connects React UI to the Python FastAPI backend
 */
import { API_BASE } from "./services";

export const supabase = {
  auth: {
    async signUp({ email, password }: { email: string; password: string }) {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { data: { user: null }, error: { message: data.detail || "Registration failed" } };
      }
      localStorage.setItem("msme_token", data.token);
      localStorage.setItem("msme_user", JSON.stringify(data.user));
      return { data: { user: data.user }, error: null };
    },

    async signInWithPassword({ email, password }: { email: string; password: string }) {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { data: { user: null }, error: { message: data.detail || "Login failed" } };
      }
      localStorage.setItem("msme_token", data.token);
      localStorage.setItem("msme_user", JSON.stringify(data.user));
      return { data: { user: data.user }, error: null };
    },

    async signOut() {
      localStorage.removeItem("msme_token");
      localStorage.removeItem("msme_user");
      return { error: null };
    },

    async getUser() {
      const userStr = localStorage.getItem("msme_user");
      if (userStr) {
        return { data: { user: JSON.parse(userStr) }, error: null };
      }
      return { data: { user: null }, error: null };
    },
  },
};
