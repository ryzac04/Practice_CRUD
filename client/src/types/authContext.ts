export interface LoginBody {
    email?: string;
    username?: string;
    password: string
};

export interface AuthContextValue {
    token: string | null;
    currentUserId: number | null;
    login: (body: LoginBody) => Promise<void>;
    logout: () => void;
    isAuthed: boolean;
    authLoading: boolean; 
}