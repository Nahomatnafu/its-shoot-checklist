"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useShootStore from "../store/useShootStore";
import PopUpModal from "../../components/PopUpModal";
import styles from "../../../styles/ShootsPage.module.css";

export default function ShootsPage() {
  const router = useRouter();
  const { shoots, setShoots, deleteShoot } = useShootStore();

  const [filteredShoots, setFilteredShoots] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("All");

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("savedShoots")) || [];
    // Ensure all shoots have valid IDs
    const validShoots = stored.filter(shoot => shoot && shoot.id);
    setShoots(validShoots);
    setFilteredShoots(validShoots);
  }, [setShoots]);

  useEffect(() => {
    let filtered = [...shoots].filter(shoot => shoot && shoot.id);

    if (selectedYear !== "All") {
      filtered = filtered.filter((s) => s.date?.includes(selectedYear));
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter((s) =>
        s.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredShoots(filtered);
  }, [searchTerm, selectedYear, shoots]);

  const handleShootClick = (id) => {
    router.push(`/shoots/${id}`);
  };

  const handleDeleteRequest = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedId(id);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedId) {
      deleteShoot(selectedId);
      // Update filtered shoots after deletion
      setFilteredShoots(prevShoots => 
        prevShoots.filter(shoot => shoot.id !== selectedId)
      );
    }
    setShowConfirm(false);
    setSelectedId(null);
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
            <option key={`year-${year}`} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {filteredShoots.length === 0 ? (
        <p className={styles.noShoots}>No shoots match your criteria.</p>
      ) : (
        <ul className={styles.shootList}>
          {filteredShoots.map((shoot) => (
            shoot && shoot.id ? (
              <li key={`shoot-${shoot.id}`} className={styles.shootCard}>
                <div
                  onClick={() => handleShootClick(shoot.id)}
                  className={styles.shootInfo}
                >
                  📸 {shoot.title || 'Untitled'}
                  <span className={styles.shootDate}>({shoot.date || 'No date'})</span>
                </div>
                <button
                  onClick={(e) => handleDeleteRequest(shoot.id, e)}
                  className={styles.deleteButton}
                >
                  🗑 Delete
                </button>
              </li>
            ) : null
          ))}
        </ul>
      )}

      {/* 🔙 Back Button */}
      <button onClick={() => router.push("/dashboard")} className={styles.backButton}>
        Back
      </button>

      {/* 🧠 Confirmation Modal */}
      {showConfirm && (
        <PopUpModal
          message="Are you sure you want to delete this shoot?"
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowConfirm(false);
            setSelectedId(null);
          }}
        />
      )}
    </main>
  );
}
