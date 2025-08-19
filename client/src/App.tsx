import { Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UsersList from "./pages/UsersList";
import EditUser from "./pages/EditUser";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const { authLoading } = useAuth(); 

  if (authLoading) {
    return <div>Loading authentication...</div>
  }
  return (
    <>
      <NavBar />
      <div style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UsersList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users/profile/:id"
            element={
              <ProtectedRoute>
                <EditUser />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  )
};