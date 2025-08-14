import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Usage: element={<ProtectedRoute><UsersList /></ProtectedRoute>}
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthed } = useAuth(); 
    if (!isAuthed) return <Navigate to="/login" replace />;
    return <>{children}</>; 
}
