"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "../../styles/ShootTypePage.module.css";

export default function ShootTypePage({ title, categories }) {
  const [checkedItems, setCheckedItems] = useState({});
  const [checkedCategories, setCheckedCategories] = useState({});
  const router = useRouter();
  const { type } = useParams();

  // ✅ Reset checkboxes when the page changes
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

  // ✅ Toggle all items in a category
  const handleCategoryToggle = (categoryName, items) => {
    const isCategoryChecked = checkedCategories[categoryName] || false;
    const newCheckedState = !isCategoryChecked;

    // ✅ Update category selection state
    setCheckedCategories((prev) => ({
      ...prev,
      [categoryName]: newCheckedState,
    }));

    // ✅ Update all checkboxes in the category
    setCheckedItems((prev) => {
      const updatedItems = { ...prev };
      items.forEach((item) => {
        updatedItems[item.name] = { takeOut: newCheckedState };
      });

      return updatedItems; // ✅ Ensure toggle works properly
    });
  };

  const handleSave = () => {
    const shootTitle = prompt("Enter a title for this shoot:");
    if (!shootTitle) return; // If user cancels, do nothing

    // ✅ Retrieve existing shoots from localStorage or initialize empty array
    const storedShoots = JSON.parse(localStorage.getItem("savedShoots")) || [];

    // ✅ Store new shoot with title, date, and checked items
    const newShoot = {
      title: shootTitle,
      date: new Date().toLocaleDateString(),
      checklist: checkedItems, // Save all checked items
    };

    // ✅ Save updated shoots list in localStorage
    localStorage.setItem(
      "savedShoots",
      JSON.stringify([...storedShoots, newShoot])
    );

    alert("Shoot saved successfully!"); // ✅ Show success message
    router.push("/shoots"); // ✅ Redirect to Shoots page
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>📝 {title}</h1>

      <div className={styles.grid}>
        {categories.map((category, index) => (
          <div key={category.name} className={styles.categoryWrapper}>
            {/* ✅ Category Title + Select All Checkbox */}
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

            {/* ✅ Equipment Items */}
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

      {/* ✅ Save Button at Bottom Right */}
      <button className={styles.saveButton} onClick={handleSave}>
        Save Shoot
      </button>
    </main>
  );
}
