import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Congrats({ setIsLoggedIn , setCurrentUser, currentUser }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null)
    navigate("/");
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:3000/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const userToDelete = users.find((user) => user.id === id);

    const message =
        userToDelete.username === currentUser
        ? "⚠️ You are about to delete your own account. Are you sure? This will log you out immediately."
        : "Are you sure you want to delete this user?";

    if (!window.confirm(message)) return;

    try {
        const res = await fetch(`http://localhost:3000/users/${id}`, {
        method: "DELETE",
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || "Failed to delete user");
        }

        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        if(userToDelete.username === currentUser) {
            handleLogout();
        }
    } catch (err) {
        alert(err.message);
    }
 };

  const fieldStyle = { marginBottom: "20px" };

  return (
    <div style={{ marginLeft: "70px" }}>
      <h1>🎉 Congrats! You've logged in!</h1>

      <h2>Top Insecure User Accounts Leaderboard 🎉</h2>
      {loading && <p>Loading users...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

    <div style={fieldStyle}>
      {!loading && !error && (
        <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Password</th>
              <th>Delete User</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>1</td>
                <td>
                    {user.username === currentUser
                        ? `${user.username} (this is you!)`
                        : user.username}
                </td>
                <td>{user.password_plain}</td>
                <td>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>

    <div style={fieldStyle}>
      <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Congrats;