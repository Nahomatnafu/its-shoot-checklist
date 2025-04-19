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
      // Make sure we're using the correct API URL
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      console.log('Attempting to connect to:', API_URL); // Debug log
      
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({ 
          email: email.trim(),
          password 
        }),
      });

      console.log('Full API URL:', `${API_URL}/auth/login`); // Debug log
      console.log('Request payload:', { email: email.trim(), password: '***' }); // Debug log
      console.log('Response status:', res.status); // Debug log
      
      const data = await res.json();
      console.log('Response data:', data); // Debug log

      if (res.ok) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("storage")); 
        
        setLoginStatus("success");
        setErrorMessage("");
        setTimeout(() => router.push("/dashboard"), 1000);
      } else {
        setLoginStatus("error");
        setErrorMessage(data.message || "Login failed");
      }
    } catch (error) {
      console.error('Detailed login error:', error); // Enhanced error logging
      setLoginStatus("error");
      setErrorMessage(`Connection error: ${error.message}`);
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





