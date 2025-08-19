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

// import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
// import { loginApi } from "../api/auth";
// import { setAuthToken } from "../api/apiClient";
// import type { LoginBody } from "../types/authContext";
// import type { AuthContextValue } from "../types/authContext";
// import { jwtDecode } from "jwt-decode";

// const AuthContext = createContext<AuthContextValue | undefined>(undefined); 

// interface DecodedToken {
//     sub: number
// }

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//     // Initialize from localStorage so refresh keeps user logged in. 
//     const [token, setToken] = useState<string | null>(() => {
//         const storedToken = localStorage.getItem("token");
//         console.log("AuthProvider: Initializing token from localStorage:", storedToken ? "Token found" : "No token found"); // [1] Initial token check
//         return storedToken;
//     });
//     const [currentUserId, setCurrentUserId] = useState<number | null>(null); 
//     const [authLoading, setAuthLoading] = useState(true); 

//     // Keep axios auth header synced with token
//     useEffect(() => {
//         console.log("AuthProvider useEffect: Token changed to:", token); // [2] Token change detection
//         setAuthToken(token);

//         if (token) {
//             try {
//                 const decodedToken = jwtDecode<DecodedToken>(token);
//                 setCurrentUserId(decodedToken.sub); 
//                 console.log("AuthProvider useEffect: Token decoded. currentUserId:", decodedToken.sub); // [3] Successful token decode
//             } catch (err) {
//                 console.error("AuthProvider useEffect: Error decoding token:", err); // [4] Token decode error
//                 logout(); // This will also update token to null and clear localStorage
//             }
//         } else {
//             setCurrentUserId(null);
//             console.log("AuthProvider useEffect: No token, currentUserId set to null."); // [5] No token scenario
//         }
//         setAuthLoading(false); 
//         console.log("AuthProvider useEffect: authLoading set to false."); // [6] authLoading update
//     }, [token]); // Added logout to dependency array

//     const login = async (body: LoginBody) => {
//         console.log("AuthProvider login: Attempting login..."); // [7] Login initiation
//         const { access_token } = await loginApi(body);
//         localStorage.setItem("token", access_token);
//         setToken(access_token);
//         console.log("AuthProvider login: Login successful, token set."); // [8] Login success
//     };

//     const logout = () => {
//         console.log("AuthProvider logout: Logging out..."); // [9] Logout initiation
//         localStorage.removeItem("token");
//         setToken(null);
//         setCurrentUserId(null); 
//         console.log("AuthProvider logout: Token and currentUserId cleared."); // [10] Logout complete
//     };

//     const value = useMemo(
//         () => {
//             console.log("AuthProvider useMemo: Context value re-calculated. isAuthed:", Boolean(token), "currentUserId:", currentUserId, "authLoading:", authLoading); // [11] Context value update
//             return { token, login, logout, isAuthed: Boolean(token), currentUserId, authLoading };
//         },
//         [token, currentUserId, authLoading]
//     );

//     return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
// };

// export function useAuth() {
//     const ctx = useContext(AuthContext);
//     if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//     return ctx; 
// }
