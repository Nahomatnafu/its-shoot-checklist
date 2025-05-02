"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useWaiverStore from "../../store/useWaiverStore";
import ImageWaiverForm from "../../../components/ImageWaiverForm";
import styles from "../../../../styles/SavedImageWaivers.module.css";

export default function WaiverDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getWaiverById, setWaivers } = useWaiverStore();
  const [waiver, setWaiver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Add AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const loadWaiver = async () => {
      try {
        // First check if we already have the waiver in store
        const cachedWaiver = getWaiverById(id);
        
        if (cachedWaiver) {
          setWaiver(cachedWaiver);
          setLoading(false);
          return;
        }
        
        // If not in store, load all waivers (with timeout)
        await setWaivers(controller.signal);
        
        // Then get the specific waiver
        const waiverData = getWaiverById(id);
        if (waiverData) {
          setWaiver(waiverData);
        } else {
          console.error('Waiver not found:', id);
          setError('Waiver not found');
        }
      } catch (error) {
        console.error('Error loading waiver:', error);
        setError(error.name === 'AbortError' 
          ? 'Request timed out. Please try again.' 
          : error.message || 'Failed to load waiver');
      } finally {
        setLoading(false);
        clearTimeout(timeoutId);
      }
    };

    loadWaiver();
    
    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [id, setWaivers, getWaiverById, router]);

  // Add early return for loading state
  if (loading) return <div className={styles.loading}>Loading waiver details...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!waiver) return <div className={styles.error}>Waiver not found</div>;

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>Saved Image Waiver</h1>
      <div className={styles.formWrapper}>
        <ImageWaiverForm formData={waiver} readOnly />
      </div>
      <button
        onClick={() => router.push("/saved-image-waivers")}
        className={styles.backButton}
      >
        Back
      </button>
    </main>
  );
}
