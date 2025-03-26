"use client"; // ✅ Mark this as a client component
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Use router.replace()
import styles from "./Dashboard.module.css";
import Footer from "@/components/Footer";

const shootTypes = [
  {
    name: "A-Roll Shoot (Teleprompter)",
    path: "/shoot-types/teleprompter",
    image: "/Teleprompter.png",
  },
  {
    name: "A-Roll & B-Roll (Documentary)",
    path: "/shoot-types/documentary",
    image: "/Documentary Style.png",
  },
  {
    name: "A-Roll Shoot (Broadcast)",
    path: "/shoot-types/broadcast",
    image: "/Broadcast Style.png",
  },
  {
    name: "B-Roll Shoot (Coverage)",
    path: "/shoot-types/coverage",
    image: "/Coverage Footage.png",
  },
  {
    name: "Photoshoot",
    path: "/shoot-types/photoshoot",
    image: "/Photoshoot.png",
  },
];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Track if we're still checking auth

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.replace("/login"); // ✅ Instantly redirect before rendering UI
    } else {
      setUser(JSON.parse(userData)); // ✅ Store user data
      setLoading(false); // ✅ Mark authentication as checked
    }
  }, []);

  // 🔥 Prevents ANY rendering (including Header) until authentication is checked
  if (loading) return null;

  return (
    <>
      <main className={styles.container}>
        <h1 className={styles.heading}>Are you ready for the shoot today?</h1>
        <p className={styles.subtext}>Choose a shoot type</p>

        <div className={styles.grid}>
          {shootTypes.map((shoot) => (
            <div
              key={shoot.name}
              className={styles.card}
              onClick={() => router.push(shoot.path)}
            >
              <Image
                src={shoot.image}
                alt={shoot.name}
                width={300}
                height={500}
                className={styles.thumbnail}
                style={{ objectFit: "cover" }}
              />
              <h2 className={styles.cardTitle}>{shoot.name}</h2>
            </div>
          ))}
        </div>

        {/* 🔹 Logout Button */}
        {/* <button
          className={styles.logoutButton}
          onClick={() => {
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            router.replace("/login"); // ✅ Redirect instantly on logout
          }}
        >
          Logout
        </button> */}
      </main>
      <Footer />
    </>
  );
}
