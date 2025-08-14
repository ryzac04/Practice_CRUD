export type LoginBody = { email?: string; username?: string; password: string };

export interface AuthContextValue {
    token: string | null;
    login: (body: LoginBody) => Promise<void>;
    logout: () => void;
    isAuthed: boolean;
}