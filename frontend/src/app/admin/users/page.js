"use client";
import styles from "../../../../styles/Users.module.css";
import { useState, useEffect } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null); // ✅ Track user being edited
  const [updatedUser, setUpdatedUser] = useState({}); // ✅ Store updated data

  // ✅ Fetch all users
  useEffect(() => {
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
  }, []);

  // ✅ Handle user deletion
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

  // ✅ Open edit form with selected user data
  const handleEdit = (user) => {
    setEditUser(user);
    setUpdatedUser({
      name: user.name,
      email: user.email,
      position: user.position,
      role: user.role,
    });
  };

  // ✅ Handle input changes in edit form
  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  // ✅ Handle update submission
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
        setEditUser(null); // ✅ Close modal
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
              {/* 🖊️ Edit Button */}
              <button
                onClick={() => handleEdit(user)}
                className={styles.editButton}
              >
                Edit
              </button>

              {/* 🗑️ Delete Button */}
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

      {/* 🔹 Edit Modal */}
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
