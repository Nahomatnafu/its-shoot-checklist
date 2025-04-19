"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // ✅ this line fixes the error
import styles from "../../../styles/Admin.module.css";
import PopUpModal from "@/components/PopUpModal"; // ✅ if you're using PopUpModal

export default function AdminPage() {
  const router = useRouter();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showModal, setShowModal] = useState(false); // ✅ modal state

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    position: "",
    role: "student",
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.replace("/login");
      return;
    }

    const user = JSON.parse(userData);
    if (user.role !== "admin") {
      router.replace("/dashboard");
    } else {
      setIsAuthorized(true);
    }
  }, []);

  if (!isAuthorized) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = { ...formData, password: "password0000" };

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const data = await res.json();

      if (res.ok) {
        setFormData({ name: "", email: "", position: "", role: "student" });
        setShowModal(true); // ✅ show modal on success
      } else {
        alert("❌ " + (data.message || "Failed to add user"));
      }
    } catch (error) {
      console.error("❌ Error:", error);
      alert("❌ Something went wrong. Check the console.");
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Admin Panel</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Input Fields */}
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className={styles.input}
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className={styles.input}
            required
          />
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            placeholder="Position"
            className={styles.input}
            required
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={styles.input}
          >
            <option value="student">Student</option>
            <option value="its-staff">ITS Staff</option>
            <option value="admin">Admin</option>
          </select>
          <button className={styles.button}>Add User</button>
        </form>

        <button
          className={styles.secondaryButton}
          onClick={() => router.push("/admin/users")}
        >
          View Users
        </button>
      </div>

      {/* ✅ PopUp Modal */}
      {showModal && (
        <PopUpModal
          message="User added successfully!"
          onConfirm={() => setShowModal(false)}
          onCancel={() => setShowModal(false)}
        />
      )}
    </main>
  );
}
