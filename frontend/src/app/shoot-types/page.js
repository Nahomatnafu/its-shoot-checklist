"use client";
import { useState } from "react";

export default function ShootTypePage({ title, categories }) {
  const [checkedItems, setCheckedItems] = useState({});

  const handleCheck = (category, item) => {
    setCheckedItems((prev) => ({
      ...prev,
      [`${category} - ${item}`]: !prev[`${category} - ${item}`],
    }));
  };

  const handleSave = () => {
    console.log("📌 Save button clicked"); // ✅ Log when the function runs

    const shootTitle = window.prompt("Enter a title for this shoot:");
    console.log("📌 Shoot Title Entered:", shootTitle); // ✅ Log the entered title

    if (!shootTitle) {
      console.log("❌ No title entered, saving cancelled.");
      return; // If user cancels, do nothing
    }

    const storedShoots = JSON.parse(localStorage.getItem("savedShoots")) || [];
    const newShoot = {
      title: shootTitle,
      date: new Date().toLocaleDateString(),
      checklist: checkedItems, // Save checked items
    };

    localStorage.setItem(
      "savedShoots",
      JSON.stringify([...storedShoots, newShoot])
    );
    console.log("✅ Shoot saved successfully!", newShoot);

    alert("Shoot saved successfully!");
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">{title} Checklist</h1>

      {categories.map((category) => (
        <div key={category.name} className="mb-4">
          <h2 className="text-lg font-semibold">{category.name}</h2>
          <ul>
            {category.items.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={checkedItems[`${category.name} - ${item}`] || false}
                  onChange={() => handleCheck(category.name, item)}
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <button
        onClick={handleSave}
        className="bg-yellow-500 text-white px-4 py-2 mt-4 rounded"
      >
        Save Shoot
      </button>
    </main>
  );
}
