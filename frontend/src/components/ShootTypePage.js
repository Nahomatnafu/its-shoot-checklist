"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "../../styles/ShootTypePage.module.css";
import saveShootToLocalStorage from "../app/utils/saveShootToLocalStorage";

export default function ShootTypePage({ title, categories }) {
  const [checkedItems, setCheckedItems] = useState({});
  const [checkedCategories, setCheckedCategories] = useState({});
  const router = useRouter();
  const { type } = useParams();

  useEffect(() => {
    setCheckedItems({});
    setCheckedCategories({});
  }, [type]);

  const handleCheckboxChange = (item, type) => {
    setCheckedItems((prev) => ({
      ...prev,
      [item]: { ...prev[item], [type]: !prev[item]?.[type] },
    }));
  };

  const handleCategoryToggle = (categoryName, items) => {
    const newCheckedState = !checkedCategories[categoryName];
    setCheckedCategories((prev) => ({
      ...prev,
      [categoryName]: newCheckedState,
    }));

    setCheckedItems((prev) => {
      const updated = { ...prev };
      items.forEach((item) => {
        updated[item.name] = { takeOut: newCheckedState };
      });
      return updated;
    });
  };

  const handleSave = () => {
    const shootTitle = prompt("Enter a title for this shoot:");
    if (!shootTitle) return;

    const shootId = saveShootToLocalStorage(
      shootTitle,
      type,
      checkedItems,
      categories
    );

    router.push(`/shoots/${shootId}`);
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>📝 {title}</h1>

      <div className={styles.grid}>
        {categories.map((category, index) => (
          <div key={category.name} className={styles.categoryWrapper}>
            <div
              className={`${styles.category} ${
                index % 2 === 0 ? styles.yellow : styles.purple
              }`}
            >
              <input
                type="checkbox"
                className={styles.categoryCheckbox}
                checked={checkedCategories[category.name] || false}
                onChange={() =>
                  handleCategoryToggle(category.name, category.items)
                }
              />
              <h2 className={styles.categoryTitle}>{category.name}</h2>
            </div>

            <div className={styles.items}>
              {category.items.map((item, itemIndex) => (
                <label
                  key={`${category.name}-${item.name}-${itemIndex}`}
                  className={styles.item}
                >
                  <input
                    type="checkbox"
                    name={category.name}
                    className={styles.checkbox}
                    checked={checkedItems[item.name]?.takeOut || false}
                    onChange={() => handleCheckboxChange(item.name, "takeOut")}
                  />
                  <span className={styles.itemText}>{item.name}</span>
                  {item.optional && (
                    <span className={styles.optional}>(Optional)</span>
                  )}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className={styles.saveButton} onClick={handleSave}>
        Save Shoot
      </button>
    </main>
  );
}
