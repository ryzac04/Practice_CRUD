import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { "Content-Type": "application/json" },
});

// Small helper so we can set/remove the Authorization header globally
export function setAuthToken(token: string | null) {
    if (token) {
        API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete API.defaults.headers.common["Authorization"]; 
    }
}; 

export default API; 