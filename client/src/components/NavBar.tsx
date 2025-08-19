import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
    const { isAuthed, logout, currentUserId } = useAuth();
    const nav = useNavigate();

    return (
        <nav style={{ display: "flex", gap: 12, padding: 12, borderBottom: "1px solid #ddd" }}>
            <Link to="/" className="text-white">Home</Link>
            <Link to="/users" className="text-white">Users</Link>
            {!isAuthed ? (
                <>
                    <Link to="/register" className="text-white">Register</Link>
                    <Link to="/login" className="text-white">Login</Link>
                </>
            ) : (
                    <>
                        {currentUserId && <Link to={`/users/profile/${currentUserId}`} className="text-white">Edit Page</Link>}
                <button
                    onClick={() => {
                        logout();
                        nav("/login");
                    }}
                    className="text-white border border-white hover:cursor-pointer"
                >Logout
                </button>
                    </>
                )
            }
        </nav>
    )
};