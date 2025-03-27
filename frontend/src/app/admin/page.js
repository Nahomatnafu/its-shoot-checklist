"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../../styles/Admin.module.css";

export default function AdminPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    position: "",
    role: "student",
  });

  // ✅ Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle form submission (Add user)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = { ...formData, password: "password0000" };

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ User added successfully!");
        setFormData({ name: "", email: "", position: "", role: "student" });
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

        {/* 🔹 Users Button to Navigate to Users List */}
        <button
          className={styles.secondaryButton}
          onClick={() => router.push("/admin/users")}
        >
          View Users
        </button>
      </div>
    </main>
  );
}
