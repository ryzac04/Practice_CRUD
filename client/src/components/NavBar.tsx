import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
    const { isAuthed, logout, currentUserId } = useAuth();
    const nav = useNavigate();

    return (
        <nav style={{ display: "flex", gap: 12, padding: 12, borderBottom: "1px solid #ddd" }}>
            <Link to="/">Home</Link>
            <Link to="/users">Users</Link>
            {!isAuthed ? (
                <>
                    <Link to="/register">Register</Link>
                    <Link to="/login">Login</Link>
                </>
            ) : (
                    <>
                        {currentUserId && <Link to={`/users/profile/${currentUserId}`}>Edit Page</Link>}
                <button
                    onClick={() => {
                        logout();
                        nav("/login");
                    }}
                >Logout
                </button>
                    </>
                )
            }
        </nav>
    )
};