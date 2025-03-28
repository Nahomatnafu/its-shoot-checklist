"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../../styles/Login.module.css";
import { FiEye, FiEyeOff } from "react-icons/fi"; // 👁️

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Response data:", data);

      if (res.ok) {
        setMessage("✅ Login successful!");

        // 🔹 Store the token in localStorage
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user)); // Store user details
        // Force Header to re-check user state
        window.dispatchEvent(new Event("storage"));
        setTimeout(() => {
          router.push("/dashboard"); // Redirect to dashboard after login
        }, 1000);
      } else {
        setMessage(`❌ ${data.message || "Login failed"}`);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setMessage("❌ Something went wrong. Try again later.");
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Login</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.inputWithIcon}
            />
            <span
              className={styles.eyeIconInside}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <button type="submit" className={styles.button}>
            Login
          </button>
        </form>
        {message && (
          <p
            className={
              message.startsWith("✅")
                ? styles.messageSuccess
                : styles.messageError
            }
          >
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
