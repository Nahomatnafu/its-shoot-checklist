"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useShootStore from "../../store/useShootStore";
import styles from "../../../../styles/ShootTypePage.module.css";

export default function ShootDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const { getShootById, fetchShootById } = useShootStore();
  const [shoot, setShoot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadShoot() {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        
        let foundShoot = getShootById(id);

        if (foundShoot) {
          setShoot(foundShoot);
        } else {
          const fetchedShoot = await fetchShootById(id);
          setShoot(fetchedShoot);
        }
      } catch (error) {
        console.error("Failed to fetch shoot:", error);
        setError(error.message || "Failed to load shoot");
      } finally {
        setLoading(false);
      }
    }

    loadShoot();
  }, [id, getShootById, fetchShootById]);

  if (loading) {
    return (
      <main className={styles.container}>
        <h1 className={styles.heading}>Loading shoot...</h1>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.container}>
        <h1 className={styles.heading}>Error: {error}</h1>
        <button 
          onClick={() => router.push("/shoots")} 
          className={styles.backButton}
        >
          Back to Shoots
        </button>
      </main>
    );
  }

  if (!shoot) {
    return (
      <main className={styles.container}>
        <h1 className={styles.heading}>Shoot not found</h1>
        <button 
          onClick={() => router.push("/shoots")} 
          className={styles.backButton}
        >
          Back to Shoots
        </button>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>📝 {shoot.title}</h1>

      <div className={styles.grid}>
        {shoot.template?.map((category, index) => (
          <div key={index} className={styles.categoryWrapper}>
            <div
              className={`${styles.category} ${
                index % 2 === 0 ? styles.yellow : styles.purple
              }`}
            >
              <h2 className={styles.categoryTitle}>{category.name}</h2>
            </div>

            <div className={styles.items}>
              {category.items.map((item, i) => {
                const isChecked =
                  shoot.checklist?.[item.name]?.takeOut || false;
                return (
                  <div
                    key={i}
                    className={`${styles.item} ${
                      isChecked ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isChecked ? "✅" : "❌"}{" "}
                    <span className={styles.itemText}>{item.name}</span>
                    {item.optional && (
                      <span className={styles.optional}>(Optional)</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
