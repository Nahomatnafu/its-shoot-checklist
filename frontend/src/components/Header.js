"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import ProfileModal from "./ProfileModal";
import styles from "../../styles/Header.module.css";

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRefs = {
    waiver: useRef(null),
    shoot: useRef(null),
    credits: useRef(null),
  };

  const shootTypes = [
    { name: "A-Roll Shoot (Teleprompter)", path: "/shoot-types/teleprompter" },
    { name: "A-Roll & B-Roll (Documentary)", path: "/shoot-types/documentary" },
    { name: "A-Roll Shoot (Broadcast)", path: "/shoot-types/broadcast" },
    { name: "B-Roll Shoot (Coverage)", path: "/shoot-types/coverage" },
    { name: "Photoshoot", path: "/shoot-types/photoshoot" },
  ];

  const setUserWithCache = useMemo(
    () => (newUser) => {
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
    },
    []
  );

  const debouncedSetActiveDropdown = useCallback(
    debounce((value) => setActiveDropdown(value), 100),
    []
  );

  const handleLogout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    router.replace("/login");
  }, [router]);

  const handleProfileClick = () => {
    const updatedUser = JSON.parse(localStorage.getItem("user"));
    if (updatedUser) setUser(updatedUser);
    setProfileModalOpen(true);
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (pathname === "/login") {
          setIsLoading(false);
          return;
        }

        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          router.replace("/login");
          return;
        }

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          const API_URL = process.env.NEXT_PUBLIC_API_URL;

          try {
            // Updated URL to include /api/
            const response = await fetch(
              `${API_URL}/api/auth/user/${parsedUser.email}`,
              {
                headers: { Authorization: `Bearer ${authToken}` },
              }
            );
            if (response.ok) {
              const updatedUser = await response.json();
              setUserWithCache(updatedUser);
            }
          } catch (error) {
            console.error("Failed to fetch updated user data:", error);
          }
        } else {
          router.replace("/login");
        }
      } catch (error) {
        console.error("Error loading user:", error);
        router.replace("/login");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [pathname, router, setUserWithCache]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !Object.values(dropdownRefs).some(
          (ref) => ref.current && ref.current.contains(event.target)
        )
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  if (pathname === "/login" || isLoading) return null;

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
                onClick={() => toggleDropdown("waiver")}
              >
                Image Waiver ▼
              </button>
              {activeDropdown === "waiver" && (
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
              onClick={() => toggleDropdown("shoot")}
            >
              Shoot Type ▼
            </button>
            {activeDropdown === "shoot" && (
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
              onClick={() => toggleDropdown("credits")}
            >
              Credits ▼
            </button>
            {activeDropdown === "credits" && (
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

          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>

          <div className={styles.userProfile}>
            <Image
              src={user?.profilePic || "/quentin.png"}
              alt="User Profile"
              width={40}
              height={40}
              className={styles.userImage}
              onClick={handleProfileClick}
            />
          </div>
        </nav>

        <div className={styles.hamburger} onClick={() => setMobileMenuOpen(true)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.open : ''}`}>
          <div className={styles.mobileMenuHeader}>
            <Image
              src="/MSU_newLogo.png"
              alt="MSU Logo"
              width={60}
              height={60}
              className={styles.logo}
            />
            <button 
              className={styles.closeButton}
              onClick={() => setMobileMenuOpen(false)}
            >
              ✕
            </button>
          </div>
          
          <div className={styles.mobileMenuItems}>
            <Link 
              href="/shoots" 
              className={styles.mobileNavButton}
              onClick={() => setMobileMenuOpen(false)}
            >
              Shoots
            </Link>
            
            <div className={styles.mobileDropdownSection}>
              <div className={styles.mobileDropdownTitle}>Image Waiver</div>
              <div className={styles.mobileDropdownItems}>
                <Link
                  href="/image-waiver"
                  className={styles.mobileDropdownItem}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create New
                </Link>
                <Link
                  href="/saved-image-waivers"
                  className={styles.mobileDropdownItem}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  View Saved
                </Link>
              </div>
            </div>

            <div className={styles.mobileDropdownSection}>
              <div className={styles.mobileDropdownTitle}>Shoot Type</div>
              <div className={styles.mobileDropdownItems}>
                {shootTypes.map((shoot) => (
                  <Link
                    key={shoot.name}
                    href={shoot.path}
                    className={styles.mobileDropdownItem}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {shoot.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className={styles.mobileDropdownSection}>
              <div className={styles.mobileDropdownTitle}>Credits</div>
              <div className={styles.mobileDropdownItems}>
                <Link
                  href="/credits/create"
                  className={styles.mobileDropdownItem}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create New
                </Link>
                <Link
                  href="/credits"
                  className={styles.mobileDropdownItem}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  View Saved
                </Link>
              </div>
            </div>
          </div>

          <div className={styles.mobileUserSection}>
            {user?.role === "admin" && (
              <button
                className={styles.mobileNavButton}
                onClick={() => {
                  router.push("/admin");
                  setMobileMenuOpen(false);
                }}
              >
                Admin Panel
              </button>
            )}
            
            <div className={styles.userProfile}>
              <Image
                src={user?.profilePic || "/quentin.png"}
                alt="User Profile"
                width={50}
                height={50}
                className={styles.userImage}
                onClick={() => {
                  handleProfileClick();
                  setMobileMenuOpen(false);
                }}
              />
            </div>
            
            <button 
              className={styles.logoutButton} 
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
            >
              Logout
            </button>
          </div>
        </div>
      )}

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={user}
        onUpdate={(updatedUser) => {
          setUserWithCache(updatedUser);
        }}
      />
    </>
  );

  function toggleDropdown(name) {
    debouncedSetActiveDropdown(name);
  }
}
