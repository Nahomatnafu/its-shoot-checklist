"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useWaiverStore from "../store/useWaiverStore";
import PopUpModal from "@/components/PopUpModal";
import { generateWaiverPDF } from "../../utils/pdfGenerator";
import styles from "../../../styles/SavedImageWaivers.module.css";

export default function SavedImageWaivers() {
  const router = useRouter();
  const { waivers, setWaivers, deleteWaiver } = useWaiverStore();
  const [filteredWaivers, setFilteredWaivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    async function loadWaivers() {
      try {
        setLoading(true);
        await setWaivers();
      } catch (error) {
        console.error('Error loading waivers:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadWaivers();
  }, [setWaivers]);

  useEffect(() => {
    let filtered = [...(waivers || [])];

    if (selectedYear !== "All") {
      filtered = filtered.filter((w) => {
        const waiverDate = new Date(w.date);
        return waiverDate.getFullYear().toString() === selectedYear;
      });
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter((w) =>
        (w.projectName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (w.name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
      );
    }

    setFilteredWaivers(filtered);
  }, [searchTerm, selectedYear, waivers]);

  const getAvailableYears = () => {
    if (!waivers) return [];
    const years = waivers.map((w) => new Date(w.date).getFullYear().toString());
    return Array.from(new Set(years)).sort((a, b) => b - a);
  };

  const handleDeleteRequest = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleDownloadPDF = async (waiver, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await generateWaiverPDF(waiver);
    } catch (error) {
      console.error('Failed to download PDF:', error);
      alert('Failed to download PDF. Please try again.');
    }
  };

  const confirmDelete = async () => {
    if (selectedId) {
      try {
        await deleteWaiver(selectedId);
        setShowModal(false);
        setSelectedId(null);
      } catch (error) {
        console.error('Error deleting waiver:', error);
        setError('Failed to delete waiver');
      }
    }
  };

  if (loading) {
    return <div className={styles.container}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.container}>Error: {error}</div>;
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>Saved Image Waivers</h1>

      <div className={styles.filterBar}>
        <input
          type="text"
          placeholder="Search by name or project..."
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
      
      {(!filteredWaivers || filteredWaivers.length === 0) ? (
        <p className={styles.noWaivers}>No waivers found.</p>
      ) : (
        <ul className={styles.waiverList}>
          {filteredWaivers.map((waiver) => (
            <li
              key={waiver._id}
              className={styles.waiverCard}
              onClick={() => router.push(`/saved-image-waivers/${waiver._id}`)}
            >
              <div className={styles.waiverInfo}>
                <h3>📑 {waiver.projectName || 'Untitled'}</h3>
                <p className={styles.createdBy}>Name: {waiver.name}</p>
                <p className={styles.date}>
                  {new Date(waiver.date).toLocaleDateString()}
                </p>
              </div>
              <div className={styles.buttonGroup}>
                <button
                  onClick={(e) => handleDownloadPDF(waiver, e)}
                  className={styles.downloadButton}
                  title="Download as PDF"
                >
                  📥 Download
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteRequest(waiver._id);
                  }}
                  className={styles.deleteButton}
                >
                  🗑 Delete
                </button>
              </div>
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

      {showModal && (
        <PopUpModal
          message="Are you sure you want to delete this waiver?"
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowModal(false);
            setSelectedId(null);
          }}
        />
      )}
    </main>
  );
}
