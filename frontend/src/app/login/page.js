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
    
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    console.log('API_URL:', API_URL); // Debug log

    try {
      const loginUrl = `${API_URL}/auth/login`;
      console.log('Attempting login at:', loginUrl); // Debug log

      const requestBody = {
        email: email.trim(),
        password,
      };
      console.log('Request body:', requestBody); // Debug log

      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status); // Debug log
      console.log('Response headers:', Object.fromEntries(response.headers)); // Debug log

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData); // Debug log
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      console.log('Success response:', data); // Debug log
      
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      setLoginStatus("success");
      setErrorMessage("");
      
      router.push("/dashboard");
    } catch (error) {
      console.error('Login error:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      }); // Detailed error log
      setLoginStatus("error");
      setErrorMessage(error.message || 'Connection error');
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













