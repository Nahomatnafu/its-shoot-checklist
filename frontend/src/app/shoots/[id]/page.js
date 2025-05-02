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
    // Add AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    async function loadShoot() {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        
        // First try to get from store (instant)
        let foundShoot = getShootById(id);

        if (foundShoot) {
          setShoot(foundShoot);
          setLoading(false);
        } else {
          // If not in store, fetch with timeout
          const fetchedShoot = await fetchShootById(id, controller.signal);
          setShoot(fetchedShoot);
        }
      } catch (error) {
        console.error("Failed to fetch shoot:", error);
        setError(error.name === 'AbortError' 
          ? 'Request timed out. Please try again.' 
          : error.message || "Failed to load shoot");
      } finally {
        setLoading(false);
        clearTimeout(timeoutId);
      }
    }

    loadShoot();
    
    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [id, getShootById, fetchShootById]);

  // Add early return for loading state
  if (loading) return <div className={styles.loading}>Loading shoot details...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!shoot) return <div className={styles.error}>Shoot not found</div>;

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
