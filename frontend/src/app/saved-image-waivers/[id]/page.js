"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ImageWaiverForm from "@/components/ImageWaiverForm";
import styles from "../../../../styles/SavedImageWaivers.module.css";

export default function WaiverDetailPage() {
  const [waiver, setWaiver] = useState(null);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const savedWaivers = JSON.parse(localStorage.getItem("savedWaivers")) || [];
    const selectedWaiver = savedWaivers[parseInt(id)];
    if (selectedWaiver) {
      setWaiver(selectedWaiver);
    } else {
      router.push("/saved-image-waivers");
    }
  }, [id]);

  if (!waiver) return <p>Loading...</p>;

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
