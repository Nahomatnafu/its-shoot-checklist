"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import ProfileModal from "../components/ProfileModal";
import styles from "../../styles/Header.module.css";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [waiverDropdownOpen, setWaiverDropdownOpen] = useState(false);
  const [shootDropdownOpen, setShootDropdownOpen] = useState(false);
  const [creditsDropdownOpen, setCreditsDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const waiverRef = useRef(null);
  const shootRef = useRef(null);
  const creditsRef = useRef(null);

  const shootTypes = [
    { name: "A-Roll Shoot (Teleprompter)", path: "/shoot-types/teleprompter" },
    { name: "A-Roll & B-Roll (Documentary)", path: "/shoot-types/documentary" },
    { name: "A-Roll Shoot (Broadcast)", path: "/shoot-types/broadcast" },
    { name: "B-Roll Shoot (Coverage)", path: "/shoot-types/coverage" },
    { name: "Photoshoot", path: "/shoot-types/photoshoot" },
  ];

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const response = await fetch(`/api/auth/user/${parsedUser.email}`);
          if (response.ok) {
            const updatedUser = await response.json();
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);
          } else {
            setUser(parsedUser);
          }
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (waiverRef.current && !waiverRef.current.contains(event.target)) {
        setWaiverDropdownOpen(false);
      }
      if (shootRef.current && !shootRef.current.contains(event.target)) {
        setShootDropdownOpen(false);
      }
      if (creditsRef.current && !creditsRef.current.contains(event.target)) {
        setCreditsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (pathname === "/login" || isLoading) return null;

  return (
    <>
      <header className={styles.header}>
        <div className={styles.leftContainer}>
          <div className={styles.leftNav}>
            <Link href="/shoots" className={styles.navButton}>
              Shoots
            </Link>
            <div className={styles.dropdownContainer} ref={waiverRef}>
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

        <nav className={styles.rightNav}>
          <div className={styles.dropdownContainer} ref={shootRef}>
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

          <div className={styles.dropdownContainer} ref={creditsRef}>
            <button
              className={styles.navButton}
              onClick={() => setCreditsDropdownOpen((prev) => !prev)}
            >
              Credits ▼
            </button>
            {creditsDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <Link
                  href="/credits/create"
                  className={styles.dropdownItem}
                  onClick={() => setCreditsDropdownOpen(false)}
                >
                  Create New
                </Link>
                <Link
                  href="/credits"
                  className={styles.dropdownItem}
                  onClick={() => setCreditsDropdownOpen(false)}
                >
                  View Saved
                </Link>
              </div>
            )}
          </div>

          {user?.role === "admin" && (
            <button
              className={styles.adminButton}
              onClick={() => router.push("/admin")}
              title="Admin Panel"
            >
              <img
                src="/MSU_Logo5.png"
                alt="Admin"
                className={styles.adminIcon}
              />
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
              src={user?.profilePic || "/quentin.png"}
              alt="User Profile"
              width={40}
              height={40}
              className={styles.userImage}
              onClick={() => {
                const updatedUser = JSON.parse(localStorage.getItem("user"));
                setUser(updatedUser);
                setProfileModalOpen(true);
              }}
            />
          </div>
        </nav>
      </header>

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={user}
        onUpdate={(updatedUser) => {
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUser(updatedUser);
        }}
      />
    </>
  );
}
