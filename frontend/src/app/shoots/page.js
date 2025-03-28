"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../../../styles/ShootsPage.module.css";

export default function ShootsPage() {
  const [shoots, setShoots] = useState([]);
  const [filteredShoots, setFilteredShoots] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("All");
  const router = useRouter();

  useEffect(() => {
    const storedShoots = JSON.parse(localStorage.getItem("savedShoots")) || [];
    setShoots(storedShoots);
    setFilteredShoots(storedShoots);
  }, []);

  useEffect(() => {
    let filtered = shoots;

    if (selectedYear !== "All") {
      filtered = filtered.filter((shoot) => shoot.date.includes(selectedYear));
    }

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((shoot) =>
        shoot.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredShoots(filtered);
  }, [searchTerm, selectedYear, shoots]);

  const handleShootClick = (shoot) => {
    const index = shoots.findIndex(
      (s) => s.title === shoot.title && s.date === shoot.date
    );
    if (index !== -1) {
      router.push(`/shoots/${index}`);
    }
  };

  const handleDelete = (indexToDelete) => {
    if (!confirm("Are you sure you want to delete this shoot?")) return;

    const updatedShoots = shoots.filter((_, i) => i !== indexToDelete);
    localStorage.setItem("savedShoots", JSON.stringify(updatedShoots));
    setShoots(updatedShoots);
  };

  const getAvailableYears = () => {
    const years = new Set(shoots.map((s) => s.date.split("/").pop()));
    return Array.from(years).sort((a, b) => b - a);
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>Saved Shoots</h1>

      <div className={styles.filterBar}>
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className={styles.yearDropdown}
        >
          <option value="All">All Years</option>
          {getAvailableYears().map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {filteredShoots.length === 0 ? (
        <p className={styles.noShoots}>No shoots match your criteria.</p>
      ) : (
        <ul className={styles.shootList}>
          {filteredShoots.map((shoot, index) => (
            <li key={index} className={styles.shootCard}>
              <div
                onClick={() => handleShootClick(shoot)}
                className={styles.shootInfo}
              >
                📸 {shoot.title}
                <span className={styles.shootDate}>({shoot.date})</span>
              </div>

              <button
                onClick={() =>
                  handleDelete(
                    shoots.findIndex(
                      (s) => s.title === shoot.title && s.date === shoot.date
                    )
                  )
                }
                className={styles.deleteButton}
              >
                🗑 Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
