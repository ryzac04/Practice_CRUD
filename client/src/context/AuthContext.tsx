import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginApi } from "../api/auth";
import { setAuthToken } from "../api/apiClient";
import type { LoginBody } from "../types/authContext";
import type { AuthContextValue } from "../types/authContext";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext<AuthContextValue | undefined>(undefined); 

interface DecodedToken {
    sub: number
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initialize from localStorage so refresh keeps user logged in. 
    const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
    const [currentUserId, setCurrentUserId] = useState<number | null>(null); 
    const [authLoading, setAuthLoading] = useState(true); 

    // Keep axios auth header synced with token
    useEffect(() => {
        setAuthToken(token);
        if (token) {
            try {
                const decodedToken = jwtDecode<DecodedToken>(token);
                setCurrentUserId(decodedToken.sub); 
            } catch (err) {
                console.error("Error decoding token:", err);
                logout(); 
            }
        } else {
            setCurrentUserId(null);
        }
        setAuthLoading(false); 
    }, [token])

    const login = async (body: LoginBody) => {
        const { access_token } = await loginApi(body);
        localStorage.setItem("token", access_token);
        setToken(access_token);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setCurrentUserId(null); 
    };

    const value = useMemo(
        () => ({ token, login, logout, isAuthed: Boolean(token), currentUserId, authLoading }),
        [token, currentUserId, authLoading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
};

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx; 
}