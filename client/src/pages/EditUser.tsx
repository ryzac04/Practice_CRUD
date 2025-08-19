import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/apiClient";
import type { User } from "../types/user";

export default function EditUser() {
  const { id } = useParams<{ id: string }>();
  const userId = id ? parseInt(id, 10) : undefined; 
  const nav = useNavigate();

  const [formData, setFormData] = useState<Partial<User>>({
    username: "",
    email: ""
  });

  useEffect(() => {
    if (userId !== undefined && !isNaN(userId)) {
      API.get(`/users/${userId}`)
        .then(res => setFormData(res.data))
        .catch(err => console.error("Error fetching user:", err));
    } else {
      console.error("Invalid user ID provided in URL:", id); 
    }

  }, [id, userId, nav]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const res = await API.patch(`/users/${userId}`, formData);
      if (res.status === 200) {
        nav(`/users/profile/${id}`); // redirect to updated profile
      }
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this account?")) return;
    try {
      const res = await API.delete(`/users/${userId}`);
      if (res.status === 200) {
        // clear token since user deleted themselves
        localStorage.removeItem("token");
        nav("/users"); // or maybe homepage
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  return (
    <div>
      <h1>Edit Profile</h1>
      <input
        name="username"
        value={formData.username || ""}
        onChange={handleChange}
        placeholder="Username"
      />
      <input
        name="email"
        value={formData.email || ""}
        onChange={handleChange}
        placeholder="Email"
      />
      <button onClick={handleUpdate}>Save Changes</button>
      <button onClick={handleDelete} style={{ color: "red" }}>
        Delete Account
      </button>
    </div>
  );
}
