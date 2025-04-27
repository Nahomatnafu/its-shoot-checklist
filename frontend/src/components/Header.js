"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import ProfileModal from "./ProfileModal";
import styles from "../../styles/Header.module.css";

// Remove lodash import and create a simple debounce function
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const dropdownRefs = {
    waiver: useRef(null),
    shoot: useRef(null),
    credits: useRef(null)
  };

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
        }
      } catch (error) {
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
      if (!Object.values(dropdownRefs).some(ref => 
        ref.current && ref.current.contains(event.target)
      )) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (name) => {
    setActiveDropdown(current => current === name ? null : name);
  };

  if (pathname === "/login" || isLoading) return null;

  // Memoize user state updates
  const setUserWithCache = useMemo(() => (newUser) => {
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  }, []);

  // Debounce frequent state updates
  const debouncedSetActiveDropdown = useCallback(
    debounce((value) => setActiveDropdown(value), 100),
    []
  );

  // Memoize handlers
  const handleLogout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    router.replace("/login");
  }, [router]);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.leftContainer}>
          <div className={styles.leftNav}>
            <Link href="/shoots" className={styles.navButton}>
              Shoots
            </Link>
            <div className={styles.dropdownContainer} ref={dropdownRefs.waiver}>
              <button
                className={styles.navButton}
                onClick={() => toggleDropdown('waiver')}
              >
                Image Waiver ▼
              </button>
              {activeDropdown === 'waiver' && (
                <div className={styles.dropdownMenu}>
                  <Link
                    href="/image-waiver"
                    className={styles.dropdownItem}
                    onClick={() => setActiveDropdown(null)}
                  >
                    Create New
                  </Link>
                  <Link
                    href="/saved-image-waivers"
                    className={styles.dropdownItem}
                    onClick={() => setActiveDropdown(null)}
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
          <div className={styles.dropdownContainer} ref={dropdownRefs.shoot}>
            <button
              className={styles.navButton}
              onClick={() => toggleDropdown('shoot')}
            >
              Shoot Type ▼
            </button>
            {activeDropdown === 'shoot' && (
              <div className={styles.dropdownMenu}>
                {shootTypes.map((shoot) => (
                  <Link
                    key={shoot.name}
                    href={shoot.path}
                    className={styles.dropdownItem}
                    onClick={() => setActiveDropdown(null)}
                  >
                    {shoot.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className={styles.dropdownContainer} ref={dropdownRefs.credits}>
            <button
              className={styles.navButton}
              onClick={() => toggleDropdown('credits')}
            >
              Credits ▼
            </button>
            {activeDropdown === 'credits' && (
              <div className={styles.dropdownMenu}>
                <Link
                  href="/credits/create"
                  className={styles.dropdownItem}
                  onClick={() => setActiveDropdown(null)}
                >
                  Create New
                </Link>
                <Link
                  href="/credits"
                  className={styles.dropdownItem}
                  onClick={() => setActiveDropdown(null)}
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
            onClick={handleLogout}
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
