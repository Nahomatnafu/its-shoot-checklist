"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../../styles/Header.module.css";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // ✅ new loading state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const shootTypes = [
    { name: "A-Roll Shoot (Teleprompter)", path: "/shoot-types/teleprompter" },
    { name: "A-Roll & B-Roll (Documentary)", path: "/shoot-types/documentary" },
    { name: "A-Roll Shoot (Broadcast)", path: "/shoot-types/broadcast" },
    { name: "B-Roll Shoot (Coverage)", path: "/shoot-types/coverage" },
    { name: "Photoshoot", path: "/shoot-types/photoshoot" },
  ];

  // ✅ Fetch user on load and watch for localStorage changes
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    loadUser();

    // ✅ Listen for changes to localStorage (e.g. after login/logout)
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ✅ Don't show header while loading OR on login page
  if (pathname === "/login" || isLoading) return null;

  return (
    <header className={styles.header}>
      {/* ✅ Left: ITS Shoot-Checklist Title */}
      <div className={styles.titleContainer}>
        <Link href="/dashboard" className={styles.titleLink}>
          <h1 className={styles.title}>ITS Shoot Checklist</h1>
        </Link>
      </div>

      {/* ✅ Centered MSU Logo */}
      <div className={styles.logoContainer}>
        <Link href="/dashboard">
          <Image
            src="/MSU_newLogo.png"
            alt="MSU Logo"
            width={90}
            height={90}
            className={styles.logo}
          />
        </Link>
      </div>

      {/* ✅ Right Nav */}
      <nav className={styles.nav}>
        <Link href="/shoots" className={styles.navButton}>
          Shoots
        </Link>

        {/* ✅ Dropdown */}
        <div className={styles.dropdownContainer} ref={dropdownRef}>
          <button
            className={styles.navButton}
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            Shoot Type ▼
          </button>
          {dropdownOpen && (
            <div className={styles.dropdownMenu}>
              {shootTypes.map((shoot) => (
                <Link
                  key={shoot.name}
                  href={shoot.path}
                  className={styles.dropdownItem}
                  onClick={() => setDropdownOpen(false)}
                >
                  {shoot.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 🔥 Admin Icon */}
        {user?.role === "admin" && (
          <button
            className={styles.adminButton}
            onClick={() => router.push("/admin")}
            title="Admin Panel"
          >
            ⚡
          </button>
        )}

        {/* ✅ Logout */}
        <button
          className={styles.logoutButton}
          onClick={() => {
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            router.replace("/login");
          }}
        >
          Logout
        </button>

        {/* ✅ Avatar */}
        <div className={styles.userProfile}>
          <Image
            src="/quentin.png"
            alt="User Profile"
            width={40}
            height={40}
            className={styles.userImage}
          />
        </div>
      </nav>
    </header>
  );
}
