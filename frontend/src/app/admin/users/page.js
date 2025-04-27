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
        const token = localStorage.getItem("authToken");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        setModalMessage("Failed to fetch users");
        setShowModal(true);
      }
    };

    fetchUsers();
  }, [isAuthorized]);

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
      const token = localStorage.getItem("authToken");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/users/${editUser._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        }
      );

      if (res.ok) {
        setUsers(
          users.map((u) =>
            u._id === editUser._id ? { ...u, ...updatedUser } : u
          )
        );
        setEditUser(null);
        setModalMessage("User updated successfully!");
        setShowModal(true);
      } else {
        throw new Error("Failed to update user");
      }
    } catch (error) {
      console.error(error);
      setModalMessage("Failed to update user");
      setShowModal(true);
    }
  };

  const handleDelete = async (userId) => {
    setPendingDeleteId(userId);
    setModalMessage("Are you sure you want to delete this user?");
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/users/${pendingDeleteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete user");

      setUsers(users.filter((user) => user._id !== pendingDeleteId));
      setModalMessage("User deleted successfully!");
    } catch (error) {
      setModalMessage("Failed to delete user");
    } finally {
      setShowModal(true);
      setPendingDeleteId(null);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalMessage("");
  };

  if (!isAuthorized) return null;

  return (
    <div className={styles.container}>
      <h1 className={styles.usersHeading}>Users List</h1>
      <div className={styles.userList}>
        {users.map((user) => (
          <div key={user._id} className={styles.userCard}>
            {editUser && editUser._id === user._id ? (
              <div className={styles.modalOverlay}>
                <div className={styles.modalCard}>
                  <h2 className={styles.modalTitle}>Edit User</h2>
                  <form onSubmit={handleUpdate} className={styles.modalForm}>
                    <input
                      type="text"
                      name="name"
                      value={updatedUser.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                    />
                    <input
                      type="email"
                      name="email"
                      value={updatedUser.email}
                      onChange={handleChange}
                      placeholder="Email"
                    />
                    <input
                      type="text"
                      name="position"
                      value={updatedUser.position}
                      onChange={handleChange}
                      placeholder="Position"
                    />
                    <select
                      name="role"
                      value={updatedUser.role}
                      onChange={handleChange}
                    >
                      <option value="student">Student</option>
                      <option value="its-staff">ITS Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                    <div className={styles.buttonGroup}>
                      <button type="submit" className={styles.saveButton}>
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
            ) : (
              <>
                <div className={styles.userInfo}>
                  <h3 className={styles.userName}>{user.name}</h3>
                </div>
                <div className={styles.buttonGroup}>
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
              </>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <PopUpModal
          message={modalMessage}
          onConfirm={pendingDeleteId ? confirmDelete : handleCloseModal}
          onCancel={handleCloseModal}
          showCancelButton={!!pendingDeleteId}
        />
      )}
    </div>
  );
}
