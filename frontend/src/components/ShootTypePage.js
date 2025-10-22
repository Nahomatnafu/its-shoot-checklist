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
  const [editingMode, setEditingMode] = useState(false);
  const [customCategories, setCustomCategories] = useState([]);

  // Reset state when type changes
  useEffect(() => {
    setCheckedItems({});
    setCheckedCategories({});
    setShootTitle("");
    setError(null);
    setCustomCategories(JSON.parse(JSON.stringify(categories))); // Deep copy
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

  // Edit category title
  const handleEditCategoryTitle = (index, newName) => {
    const updated = [...customCategories];
    updated[index].name = newName;
    setCustomCategories(updated);
  };

  // Edit item name
  const handleEditItemName = (categoryIndex, itemIndex, newName) => {
    const updated = [...customCategories];
    updated[categoryIndex].items[itemIndex].name = newName;
    setCustomCategories(updated);
  };

  // Toggle item optional status
  const handleToggleOptional = (categoryIndex, itemIndex) => {
    const updated = [...customCategories];
    updated[categoryIndex].items[itemIndex].optional = !updated[categoryIndex].items[itemIndex].optional;
    setCustomCategories(updated);
  };

  // Add new item to category
  const handleAddItem = (categoryIndex) => {
    const updated = [...customCategories];
    updated[categoryIndex].items.push({ name: "New Item", optional: false });
    setCustomCategories(updated);
  };

  // Remove item from category
  const handleRemoveItem = (categoryIndex, itemIndex) => {
    const updated = [...customCategories];
    updated[categoryIndex].items.splice(itemIndex, 1);
    setCustomCategories(updated);
  };

  // Add new category
  const handleAddCategory = () => {
    setCustomCategories([
      ...customCategories,
      { name: "New Category", items: [{ name: "New Item", optional: false }] }
    ]);
  };

  // Remove category
  const handleRemoveCategory = (index) => {
    const updated = customCategories.filter((_, i) => i !== index);
    setCustomCategories(updated);
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
        template: customCategories, // Use customCategories instead of original categories
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <h1 className={styles.heading}>📝 {title}</h1>
        <button
          onClick={() => setEditingMode(!editingMode)}
          style={{
            padding: '0.25rem 0.5rem',
            backgroundColor: 'transparent',
            color: editingMode ? '#ef4444' : '#49306e',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            lineHeight: '1',
            display: 'flex',
            alignItems: 'center',
          }}
          title={editingMode ? 'Done Editing' : 'Edit Template'}
        >
          {editingMode ? '✓' : '✏️'}
        </button>
      </div>

      <div className={styles.grid}>
        {customCategories.map((category, index) => (
          <div key={`category-${index}`} className={styles.categoryWrapper}>
            <div
              className={`${styles.category} ${
                index % 2 === 0 ? styles.yellow : styles.purple
              }`}
            >
              {editingMode ? (
                <div style={{ display: 'flex', gap: '0.5rem', width: '100%', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={category.name}
                    onChange={(e) => handleEditCategoryTitle(index, e.target.value)}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      border: 'none',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: index % 2 === 0 ? 'black' : 'white',
                    }}
                  />
                  {customCategories.length > 1 && (
                    <button
                      onClick={() => handleRemoveCategory(index)}
                      style={{
                        padding: '0.3rem 0.6rem',
                        backgroundColor: 'transparent',
                        color: '#ef4444',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                      }}
                      title="Remove category"
                    >
                      −
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <input
                    type="checkbox"
                    className={styles.categoryCheckbox}
                    checked={checkedCategories[category.name] || false}
                    onChange={() =>
                      handleCategoryToggle(category.name, category.items)
                    }
                  />
                  <h2 className={styles.categoryTitle}>{category.name}</h2>
                </>
              )}
            </div>

            <div className={styles.items}>
              {category.items.map((item, itemIndex) => (
                <div key={`item-${index}-${itemIndex}`}>
                  {editingMode ? (
                    <div
                      style={{
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center',
                        padding: '0.5rem',
                        marginBottom: '0.5rem',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '4px',
                      }}
                    >
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleEditItemName(index, itemIndex, e.target.value)}
                        style={{
                          flex: 1,
                          padding: '0.4rem',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                        }}
                      />
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        <input
                          type="checkbox"
                          checked={item.optional}
                          onChange={() => handleToggleOptional(index, itemIndex)}
                        />
                        <span style={{ fontSize: '0.85rem' }}>Optional</span>
                      </label>
                      <button
                        onClick={() => handleRemoveItem(index, itemIndex)}
                        style={{
                          padding: '0.3rem 0.6rem',
                          backgroundColor: 'transparent',
                          color: '#ef4444',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '1.2rem',
                          fontWeight: 'bold',
                        }}
                        title="Remove item"
                      >
                        −
                      </button>
                    </div>
                  ) : (
                    <label
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
                  )}
                </div>
              ))}
              {editingMode && (
                <button
                  onClick={() => handleAddItem(index)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    marginTop: '0.5rem',
                    backgroundColor: '#49306e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                  }}
                >
                  + Add Item
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {editingMode && (
        <button
          onClick={handleAddCategory}
          style={{
            width: '100%',
            padding: '0.75rem',
            marginTop: '1rem',
            marginBottom: '1rem',
            backgroundColor: '#febd11',
            color: 'black',
            border: '2px solid #49306e',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
          }}
        >
          + Add New Category
        </button>
      )}

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
