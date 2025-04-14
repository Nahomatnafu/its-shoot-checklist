"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useCreditStore from "../store/useCreditStore";
import styles from "../../../styles/Credits.module.css";

export default function SavedCreditsPage() {
  const router = useRouter();
  const { credits, setCredits, deleteCreditById } = useCreditStore();

  const [filteredCredits, setFilteredCredits] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("All");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("credits")) || [];
    setCredits(stored);
    setFilteredCredits(stored);
  }, [setCredits]);

  useEffect(() => {
    let filtered = [...credits];

    if (selectedYear !== "All") {
      filtered = filtered.filter((c) => c.projectName?.includes(selectedYear)); // Optional: You can add a "date" field later to improve this
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter((c) =>
        c.projectName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCredits(filtered);
  }, [searchTerm, selectedYear, credits]);

  const getAvailableYears = () => {
    const years = credits.map((c) => c.date?.split("/")?.[2]).filter(Boolean);
    return Array.from(new Set(years)).sort((a, b) => b - a);
  };

  const handleClick = (id) => {
    router.push(`/credits/${id}`);
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>Saved Credits</h1>

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

      {filteredCredits.length === 0 ? (
        <p className={styles.noCredits}>No credits match your criteria.</p>
      ) : (
        <ul className={styles.creditList}>
          {filteredCredits.map((credit) => (
            <li key={credit.id} className={styles.creditCard}>
              <div
                onClick={() => handleClick(credit.id)}
                className={styles.creditInfo}
              >
                🎬 {credit.projectName}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteCreditById(credit.id);
                }}
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
