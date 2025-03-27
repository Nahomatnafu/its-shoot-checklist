"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../../../../styles/ShootTypePage.module.css";

export default function ShootDetailPage() {
  const { id } = useParams();
  const [shoot, setShoot] = useState(null);

  useEffect(() => {
    const storedShoots = JSON.parse(localStorage.getItem("savedShoots")) || [];
    const selectedShoot = storedShoots[parseInt(id)];
    setShoot(selectedShoot);
  }, [id]);

  if (!shoot) {
    return (
      <main className="p-6">
        <h1 className="text-xl font-bold text-red-600">Shoot not found</h1>
      </main>
    );
  }

  const checklistEntries = Object.entries(shoot.checklist || {});

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>📝 {shoot.title}</h1>

      <div className={styles.grid}>
        {checklistEntries.map(([item, status], index) => (
          <div
            key={item}
            className={
              status?.takeOut
                ? styles.category + " " + styles.yellow
                : styles.category + " " + styles.purple
            }
            style={{ justifyContent: "center" }}
          >
            <span style={{ fontWeight: "bold" }}>
              {status?.takeOut ? "✅" : "❌"} {item}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
