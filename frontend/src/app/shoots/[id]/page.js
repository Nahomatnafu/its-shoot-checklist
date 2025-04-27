"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useShootStore from "../../store/useShootStore";
import styles from "../../../../styles/ShootTypePage.module.css";

export default function ShootDetailPage() {
  const { id } = useParams();
  const { getShootById } = useShootStore();
  const [shoot, setShoot] = useState(null);

  useEffect(() => {
    if (id) {
      const foundShoot = getShootById(id);
      setShoot(foundShoot);
    }
  }, [id, getShootById]);

  if (!shoot) {
    return (
      <main className="p-6">
        <h1 className="text-xl font-bold text-red-600">Shoot not found</h1>
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
                const isChecked = shoot.checklist?.[item.name]?.takeOut || false;
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
