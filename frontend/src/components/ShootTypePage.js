"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "../../styles/ShootTypePage.module.css";
import PopUpModal from "./PopUpModal";

import useShootStore from "../app/store/useShootStore";

export default function ShootTypePage({ title, categories }) {
  const router = useRouter();
  const { type } = useParams();
  const { createShoot, shoots } = useShootStore();  // Use createShoot from store
  
  const [checkedItems, setCheckedItems] = useState({});
  const [checkedCategories, setCheckedCategories] = useState({});
  const [shootTitle, setShootTitle] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  // Reset state when type changes
  useEffect(() => {
    setCheckedItems({});
    setCheckedCategories({});
    setShootTitle("");
    setError(null);
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
  // Add this console log at the top of your component to debug
  console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("You must be logged in to save shoots");
        router.push("/login");
        return;
      }

      const trimmedTitle = shootTitle.trim();
      if (!trimmedTitle) {
        setError("Title is required");
        return;
      }

      const shootData = {
        title: trimmedTitle,
        type: type,
        checklist: checkedItems,
        template: categories,
      };

      // Use the store's createShoot function instead of direct fetch
      const savedShoot = await createShoot(shootData);
      console.log("Saved shoot successfully:", savedShoot);

      setShowModal(false);
      router.push(`/shoots/${savedShoot._id}`);
    } catch (error) {
      console.error("Error saving shoot:", error);
      setError(error.message || "Failed to save shoot");
      if (error.message.includes("authentication")) {
        router.push("/login");
      }
    }
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
              {category.items.map((item) => (
                <label
                  key={`${category.name}-${item.name}`}
                  className={styles.item}
                >
                  <input
                    type="checkbox"
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

      <button className={styles.saveButton} onClick={() => setShowModal(true)}>
        Save Shoot
      </button>

      {showModal && (
        <PopUpModal
          message="Enter a title for this shoot:"
          showInput
          inputValue={shootTitle}
          onInputChange={setShootTitle}
          onConfirm={handleSave}
          onCancel={() => setShowModal(false)}
        />
      )}
    </main>
  );
}
