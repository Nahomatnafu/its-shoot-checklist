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
    setLoginStatus("loading");
    
    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.token) {
        // Store minimal data
        localStorage.setItem('authToken', data.token);
        
        // Store only essential user data
        const essentialUserData = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          position: data.user.position
        };
        localStorage.setItem('user', JSON.stringify(essentialUserData));
        
        setLoginStatus("success");
        
        // Prefetch dashboard data
        router.prefetch('/dashboard');
        router.push("/dashboard");
      } else {
        throw new Error('No token received from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginStatus("error");
      setErrorMessage(error.name === 'AbortError' 
        ? 'Login request timed out. Please try again.' 
        : error.message || 'Connection error');
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






















