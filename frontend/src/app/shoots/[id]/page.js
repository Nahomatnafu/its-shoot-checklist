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

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>📝 {shoot.title}</h1>

      <div className={styles.grid}>
        {shoot.template?.map((category, index) => (
          <div key={index} className={styles.categoryWrapper}>
            {/* ✅ Category Header */}
            <div
              className={`${styles.category} ${
                index % 2 === 0 ? styles.yellow : styles.purple
              }`}
            >
              <h2 className={styles.categoryTitle}>{category.name}</h2>
            </div>

            {/* ✅ Equipment Items */}
            <div className={styles.items}>
              {category.items.map((item, itemIndex) => {
                const isChecked =
                  shoot.checklist?.[item.name]?.takeOut || false;

                return (
                  <div
                    key={itemIndex}
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
