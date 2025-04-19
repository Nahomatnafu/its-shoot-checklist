"use client";
import styles from "../../../../styles/Users.module.css";
import { useState, useEffect } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import PopUpModal from "@/components/PopUpModal";

export default function UsersPage() {
  const isAuthorized = useAdminAuth();
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  useEffect(() => {
    if (!isAuthorized) return;

    const fetchUsers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/users`);
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        setModalMessage("Failed to fetch users");
        setShowModal(true);
      }
    };

    fetchUsers();
  }, [isAuthorized]);

  if (!isAuthorized) return null;

  const handleDelete = (userId) => {
    setPendingDeleteId(userId);
    setModalMessage("Are you sure you want to delete this user?");
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/users/${pendingDeleteId}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error('Failed to delete user');
      
      setUsers(users.filter((user) => user._id !== pendingDeleteId));
      setModalMessage("User deleted successfully!");
    } catch (error) {
      setModalMessage("Failed to delete user");
    } finally {
      setShowModal(true);
      setPendingDeleteId(null);
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
        setUsers(
          users.map((u) =>
            u._id === editUser._id ? { ...u, ...updatedUser } : u
          )
        );
        setEditUser(null);
        setModalMessage("✅ User updated successfully!");
        setShowModal(true);
      } else {
        setModalMessage("❌ " + (data.message || "Failed to update user"));
        setShowModal(true);
      }
    } catch (error) {
      console.error("❌ Error:", error);
      setModalMessage("❌ Error updating user");
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalMessage("");
  };

  const handleModalConfirm = () => {
    if (pendingDeleteId) {
      confirmDelete();
    } else {
      handleCloseModal();
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
                className={`p-2 border rounded text-white bg-transparent`}
              />
              <input
                type="email"
                name="email"
                value={updatedUser.email}
                placeholder="Email"
                onChange={handleChange}
                className={`p-2 border rounded text-white bg-transparent`}
              />
              <input
                type="text"
                name="position"
                value={updatedUser.position}
                placeholder="Position"
                onChange={handleChange}
                className={`p-2 border rounded text-white bg-transparent`}
              />
              <select
                name="role"
                value={updatedUser.role}
                onChange={handleChange}
                className={`p-2 border rounded bg-white text-black`}
              >
                <option value="student">Student</option>
                <option value="its-staff">ITS Staff</option>
                <option value="admin">Admin</option>
              </select>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className={styles.saveButton}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PopUp Modal for messages and confirmations */}
      {showModal && (
        <PopUpModal
          message={modalMessage}
          onConfirm={handleModalConfirm}
          onCancel={handleCloseModal}
        />
      )}
    </main>
  );
}
