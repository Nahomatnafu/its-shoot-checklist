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
  const [isLoading, setIsLoading] = useState(true);
  const [waiverDropdownOpen, setWaiverDropdownOpen] = useState(false);
  const [shootDropdownOpen, setShootDropdownOpen] = useState(false);
  const waiverDropdownRef = useRef(null);
  const shootDropdownRef = useRef(null);

  const shootTypes = [
    { name: "A-Roll Shoot (Teleprompter)", path: "/shoot-types/teleprompter" },
    { name: "A-Roll & B-Roll (Documentary)", path: "/shoot-types/documentary" },
    { name: "A-Roll Shoot (Broadcast)", path: "/shoot-types/broadcast" },
    { name: "B-Roll Shoot (Coverage)", path: "/shoot-types/coverage" },
    { name: "Photoshoot", path: "/shoot-types/photoshoot" },
  ];

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
    window.addEventListener("storage", loadUser);
    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        waiverDropdownRef.current &&
        !waiverDropdownRef.current.contains(event.target)
      ) {
        setWaiverDropdownOpen(false);
      }
      if (
        shootDropdownRef.current &&
        !shootDropdownRef.current.contains(event.target)
      ) {
        setShootDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (pathname === "/login" || isLoading) return null;

  return (
    <header className={styles.header}>
      {/* Left Side: Title and Nav */}
      <div className={styles.leftContainer}>
        <Link href="/dashboard" className={styles.titleLink}>
          <h1 className={styles.title}>ITS Shoot Checklist</h1>
        </Link>
        <div className={styles.leftNav}>
          <Link href="/shoots" className={styles.navButton}>
            Shoots
          </Link>
          {/* Image Waiver Dropdown */}
          <div className={styles.dropdownContainer} ref={waiverDropdownRef}>
            <button
              className={styles.navButton}
              onClick={() => setWaiverDropdownOpen((prev) => !prev)}
            >
              Image Waiver ▼
            </button>
            {waiverDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <Link
                  href="/image-waiver"
                  className={styles.dropdownItem}
                  onClick={() => setWaiverDropdownOpen(false)}
                >
                  Create New
                </Link>
                <Link
                  href="/saved-image-waivers"
                  className={styles.dropdownItem}
                  onClick={() => setWaiverDropdownOpen(false)}
                >
                  View Saved
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Centered MSU Logo */}
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

      {/* Right Side: Nav, Admin, Logout, Profile */}
      <nav className={styles.rightNav}>
        {/* Shoot Type Dropdown */}
        <div className={styles.dropdownContainer} ref={shootDropdownRef}>
          <button
            className={styles.navButton}
            onClick={() => setShootDropdownOpen((prev) => !prev)}
          >
            Shoot Type ▼
          </button>
          {shootDropdownOpen && (
            <div className={styles.dropdownMenu}>
              {shootTypes.map((shoot) => (
                <Link
                  key={shoot.name}
                  href={shoot.path}
                  className={styles.dropdownItem}
                  onClick={() => setShootDropdownOpen(false)}
                >
                  {shoot.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {user?.role === "admin" && (
          <button
            className={styles.adminButton}
            onClick={() => router.push("/admin")}
            title="Admin Panel"
          >
            ⚡
          </button>
        )}

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
