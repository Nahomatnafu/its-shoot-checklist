"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../../styles/Login.module.css";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState(""); // "success", "error", or ""
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("storage")); // Let Header update
        
        setLoginStatus("success");
        setErrorMessage("");
        setTimeout(() => router.push("/dashboard"), 1000);
      } else {
        setLoginStatus("error");
        setErrorMessage(data.message || "Login failed");
      }
    } catch {
      setLoginStatus("error");
      setErrorMessage("Something went wrong. Try again later.");
    }
  };

  return (
    <main className={styles.container}>
      <div className={`${styles.logoWrapper} ${
        loginStatus === "error" ? styles.logoWrapperError : ""
      }`}>
        <img
          src="/MSU_Logo5.png"
          alt="MSU IT Solutions Logo"
          className={`${styles.logo} ${
            loginStatus === "success" ? styles.logoSuccess : ""
          }`}
        />
      </div>

      <div className={styles.card}>
        <h1 className={styles.heading}>Login</h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />

          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="current-password"
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

          <button
            type="submit"
            className={`${styles.button} ${
              loginStatus === "success"
                ? styles.buttonSuccess
                : loginStatus === "error"
                ? styles.buttonError
                : ""
            }`}
          >
            Login
          </button>
        </form>

        {loginStatus === "error" && errorMessage && (
          <p className={styles.messageError}>{errorMessage}</p>
        )}
      </div>
    </main>
  );
}


