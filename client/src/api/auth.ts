import API from "./apiClient"; 
import type { AuthResponse } from "../types/user";

export async function loginApi(body: { email?: string; username?: string; password: string }) {
    // Axios infers return type, but we can state it explicitly: 
    const res = await API.post<AuthResponse>("/auth/login", body);
    return res.data; // { access_token }
}

export async function registerApi(body: { username: string; email: string; password: string }) {
    // Returns created user (backend does this)
    const res = await API.post("/auth/register", body);
    return res.data // user JSON without password 
}