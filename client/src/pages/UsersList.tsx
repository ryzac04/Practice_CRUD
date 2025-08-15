import { useEffect, useState } from "react";
import { getUsers } from "../api/users";
import type { User } from "../types/user";

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setErrMsg(null);
    getUsers()
      .then(setUsers)
      .catch((err) => {
        const msg =
          err?.response?.data?.error?.message ??
          err?.message ??
          "Failed to fetch users";
        setErrMsg(typeof msg === "string" ? msg : JSON.stringify(msg));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (errMsg) return <div style={{ color: "crimson" }}>{errMsg}</div>;

  return (
    <div>
      <h2>Users</h2>
      {users.length === 0 ? (
        <div>No users</div>
      ) : (
        <ul>
          {users.map((u) => (
            <li key={u.id}>
              {u.username} — {u.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}