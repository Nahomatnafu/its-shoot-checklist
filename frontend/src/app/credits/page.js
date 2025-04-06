"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../../../styles/Credits.module.css";

export default function SavedCreditsPage() {
  const [credits, setCredits] = useState([]);
  const [filteredCredits, setFilteredCredits] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const savedCredits = JSON.parse(localStorage.getItem("credits")) || [];
    setCredits(savedCredits);
    setFilteredCredits(savedCredits);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      const filtered = credits.filter((credit) =>
        credit.projectName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCredits(filtered);
    } else {
      setFilteredCredits(credits);
    }
  }, [searchTerm, credits]);

  const handleCreditClick = (index) => {
    router.push(`/credits/${index}`);
  };

  const handleDelete = (index) => {
    if (confirm("Are you sure you want to delete this credit?")) {
      const updatedCredits = credits.filter((_, i) => i !== index);
      localStorage.setItem("credits", JSON.stringify(updatedCredits));
      setCredits(updatedCredits);
    }
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
      </div>

      {filteredCredits.length === 0 ? (
        <p className={styles.noCredits}>No credits match your criteria.</p>
      ) : (
        <ul className={styles.creditList}>
          {filteredCredits.map((credit, index) => (
            <li key={index} className={styles.creditCard}>
              <div
                onClick={() => handleCreditClick(index)}
                className={styles.creditInfo}
              >
                🎬 {credit.projectName}
              </div>
              <button
                onClick={() => handleDelete(index)}
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
