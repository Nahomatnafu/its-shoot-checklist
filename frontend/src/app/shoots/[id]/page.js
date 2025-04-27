"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useShootStore from "../../store/useShootStore";
import styles from "../../../../styles/ShootTypePage.module.css";

export default function ShootDetailPage() {
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
        let foundShoot = getShootById(id);

        if (!foundShoot) {
          foundShoot = await fetchShootById(id);
        }

        setShoot(foundShoot);
      } catch (error) {
        console.error("Failed to fetch shoot:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadShoot();
  }, [id, getShootById, fetchShootById]);

  if (loading) {
    return (
      <main className="p-6">
        <h1 className="text-xl font-bold text-yellow-600">Loading shoot...</h1>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6">
        <h1 className="text-xl font-bold text-red-600">Error loading shoot</h1>
        <p>{error}</p>
      </main>
    );
  }

  if (!shoot) {
    return (
      <main className="p-6">
        <h1 className="text-xl font-bold text-red-600">Shoot not found</h1>
        <p>Could not find shoot with ID: {id}</p>
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
