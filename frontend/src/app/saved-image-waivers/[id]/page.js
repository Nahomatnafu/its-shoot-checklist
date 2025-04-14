"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useWaiverStore from "../../store/useWaiverStore";
import ImageWaiverForm from "../../../components/ImageWaiverForm";
import styles from "../../../../styles/SavedImageWaivers.module.css";

export default function WaiverDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getWaiverById } = useWaiverStore();
  const [waiver, setWaiver] = useState(null);

  useEffect(() => {
    const waiverData = getWaiverById(id);
    if (waiverData) {
      setWaiver(waiverData);
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
