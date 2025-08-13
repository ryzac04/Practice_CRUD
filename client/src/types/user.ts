export interface User {
    id: number;
    username: string;
    email: string;
    created_at?: string;
}

export interface AuthResponse {
    access_token: string; 
}

export interface ApiErrorPayload {
    message: string | Record<string, string[] | string>;
    code?: number;
    field?: string; 
}