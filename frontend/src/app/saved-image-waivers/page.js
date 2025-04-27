"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useWaiverStore from "../store/useWaiverStore";
import styles from "../../../styles/SavedImageWaivers.module.css";

export default function SavedImageWaivers() {
  const router = useRouter();
  const { waivers, setWaivers } = useWaiverStore();
  const [filteredWaivers, setFilteredWaivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    setFilteredWaivers(waivers || []);
  }, [waivers]);

  if (loading) {
    return <div className={styles.container}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.container}>Error: {error}</div>;
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>Saved Image Waivers</h1>
      
      {(!waivers || waivers.length === 0) ? (
        <p className={styles.noWaivers}>No waivers found.</p>
      ) : (
        <ul className={styles.waiverList}>
          {waivers.map((waiver) => (
            <li
              key={waiver._id}
              className={styles.waiverCard}
              onClick={() => router.push(`/saved-image-waivers/${waiver._id}`)}
            >
              <div className={styles.waiverInfo}>
                📑 {waiver.projectName} - {waiver.name} - {waiver.date}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteRequest(waiver._id);
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
