"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useWaiverStore from "../store/useWaiverStore";
import styles from "../../../styles/SavedImageWaivers.module.css";

export default function SavedImageWaivers() {
  const router = useRouter();
  const { waivers, setWaivers, deleteWaiverById } = useWaiverStore();
  const [filteredWaivers, setFilteredWaivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("All");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("savedWaivers")) || [];
    setWaivers(stored);
    setFilteredWaivers(stored);
  }, [setWaivers]);

  useEffect(() => {
    let filtered = [...waivers];

    if (selectedYear !== "All") {
      filtered = filtered.filter((w) => w.projectDate?.includes(selectedYear));
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter((w) =>
        w.projectName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredWaivers(filtered);
  }, [searchTerm, selectedYear, waivers]);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this waiver?")) {
      deleteWaiverById(id);
    }
  };

  const getAvailableYears = () => {
    const years = new Set(
      waivers.map((w) => w.projectDate?.split("/")?.[2] || "Unknown")
    );
    return Array.from(years).sort((a, b) => b - a);
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>Saved Image Waivers</h1>

      {/* 🔍 Filter Bar */}
      <div className={styles.filterBar}>
        <input
          type="text"
          placeholder="Search by project name..."
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

      {filteredWaivers.length === 0 ? (
        <p className={styles.noWaivers}>No waivers match your criteria.</p>
      ) : (
        <ul className={styles.waiverList}>
          {filteredWaivers.map((waiver) => (
            <li
              key={waiver.id}
              className={styles.waiverCard}
              onClick={() => router.push(`/saved-image-waivers/${waiver.id}`)}
            >
              <div className={styles.waiverInfo}>
                📑 {waiver.projectName} - {waiver.name} - {waiver.projectDate}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(waiver.id);
                }}
                className={styles.deleteButton}
              >
                🗑 Delete
              </button>
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={() => router.push("/image-waiver")}
        className={styles.backButton}
      >
        Back
      </button>
    </main>
  );
}
