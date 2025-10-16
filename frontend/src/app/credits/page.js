"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useCreditStore from "../store/useCreditStore";
import PopUpModal from "../../components/PopUpModal"; // ✅ Import the modal
import { generateCreditPDF } from "../../utils/pdfGenerator";
import styles from "../../../styles/Credits.module.css";

export default function SavedCreditsPage() {
  const router = useRouter();
  const { credits, setCredits, deleteCreditById } = useCreditStore();

  const [filteredCredits, setFilteredCredits] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("All");

  // ✅ Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("credits")) || [];
    setCredits(stored);
    setFilteredCredits(stored);
  }, [setCredits]);

  useEffect(() => {
    let filtered = [...credits];

    if (selectedYear !== "All") {
      filtered = filtered.filter((c) => c.projectName?.includes(selectedYear));
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

  const handleDeleteRequest = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (selectedId) deleteCreditById(selectedId);
    setShowModal(false);
    setSelectedId(null);
  };

  const handleDownloadPDF = async (credit, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await generateCreditPDF(credit);
    } catch (error) {
      console.error('Failed to download PDF:', error);
      alert('Failed to download PDF. Please try again.');
    }
  };

  const CreditCard = ({ credit }) => (
    <div
      className={styles.creditCard}
      onClick={() => handleClick(credit.id)} // Add this click handler
    >
      <div className={styles.creditInfo}>
        <h3>{credit.projectName}</h3>
        <p className={styles.createdBy}>Created by: {credit.user?.name || 'Unknown'}</p>
        <p className={styles.date}>
          {new Date(credit.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className={styles.buttonGroup}>
        <button
          onClick={(e) => handleDownloadPDF(credit, e)}
          className={styles.downloadButton}
          title="Download as PDF"
        >
          📥 Download
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteRequest(credit.id);
          }}
          className={styles.deleteButton}
        >
          🗑 Delete
        </button>
      </div>
    </div>
  );

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
            <CreditCard key={credit.id} credit={credit} />
          ))}
        </ul>
      )}

      {/* 🔙 Back to create new credits */}
      <button
        onClick={() => router.push("/credits/create")}
        className={styles.backButton}
      >
        Back
      </button>

      {/* 🧠 Confirmation Modal */}
      {showModal && (
        <PopUpModal
          message="Are you sure you want to delete this credit?"
          onConfirm={confirmDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
    </main>
  );
}
