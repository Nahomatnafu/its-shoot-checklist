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

  useEffect(() => {
    const loadWaiver = async () => {
      try {
        // First ensure waivers are loaded
        await setWaivers();
        
        // Then get the specific waiver
        const waiverData = getWaiverById(id);
        if (waiverData) {
          setWaiver(waiverData);
        } else {
          console.error('Waiver not found:', id);
          router.push("/saved-image-waivers");
        }
      } catch (error) {
        console.error('Error loading waiver:', error);
        router.push("/saved-image-waivers");
      } finally {
        setLoading(false);
      }
    };

    loadWaiver();
  }, [id, setWaivers, getWaiverById, router]);

  if (loading) return <p>Loading...</p>;

  if (!waiver) return null;

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
