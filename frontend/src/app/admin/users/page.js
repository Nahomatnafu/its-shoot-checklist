"use client";
import styles from "../../../../styles/Users.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({});

  // ✅ Role protection check
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.role !== "admin") {
      router.replace("/dashboard");
    } else {
      setIsAuthorized(true);
    }
  }, []);

  // ✅ Fetch users if authorized
  useEffect(() => {
    if (!isAuthorized) return;

    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/users");
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("❌ Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [isAuthorized]);

  if (!isAuthorized) return null;

  // ✅ Delete user
  const handleDelete = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/auth/users/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        alert("✅ User deleted successfully!");
        setUsers(users.filter((user) => user._id !== userId));
      } else {
        alert("❌ Failed to delete user");
      }
    } catch (error) {
      console.error("❌ Error:", error);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setUpdatedUser({
      name: user.name,
      email: user.email,
      position: user.position,
      role: user.role,
    });
  };

  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost:5000/api/auth/users/${editUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("✅ User updated successfully!");
        setUsers(
          users.map((u) =>
            u._id === editUser._id ? { ...u, ...updatedUser } : u
          )
        );
        setEditUser(null);
      } else {
        alert("❌ " + (data.message || "Failed to update user"));
      }
    } catch (error) {
      console.error("❌ Error:", error);
    }
  };

  return (
    <main className="p-6">
      <h1 className={styles.usersHeading}>Users List</h1>
      <ul>
        {users.map((user) => (
          <li
            key={user._id}
            className="flex justify-between items-center p-2 border-b"
          >
            <span className={styles.userName}>{user.name}</span>
            <div className="flex gap-3">
              <button
                onClick={() => handleEdit(user)}
                className={styles.editButton}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(user._id)}
                className={styles.deleteButton}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editUser && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <h2 className={styles.modalTitle}>Edit User</h2>
            <form onSubmit={handleUpdate} className={styles.modalForm}>
              <input
                type="text"
                name="name"
                value={updatedUser.name}
                placeholder="Full Name"
                onChange={handleChange}
                className="p-2 border rounded"
              />
              <input
                type="email"
                name="email"
                value={updatedUser.email}
                placeholder="Email"
                onChange={handleChange}
                className="p-2 border rounded"
              />
              <input
                type="text"
                name="position"
                value={updatedUser.position}
                placeholder="Position"
                onChange={handleChange}
                className="p-2 border rounded"
              />
              <select
                name="role"
                value={updatedUser.role}
                onChange={handleChange}
                className={styles.selectDropdown}
              >
                <option value="student">Student</option>
                <option value="its-staff">ITS Staff</option>
                <option value="admin">Admin</option>
              </select>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
