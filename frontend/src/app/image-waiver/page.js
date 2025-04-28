"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageWaiverForm from "@/components/ImageWaiverForm";
import PopUpModal from "@/components/PopUpModal";
import useWaiverStore from "../store/useWaiverStore";
import styles from "../../../styles/ImageWaiver.module.css";

export default function ImageWaiverPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { addWaiver } = useWaiverStore();

  const handleSaveWaiver = async (formData) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("You must be logged in to save waivers");
        router.push("/login");
        return;
      }

      // Add date to formData
      const waiverData = {
        ...formData,
        date: new Date().toISOString(),
      };

      const savedWaiver = await addWaiver(waiverData);
      console.log("Saved waiver successfully:", savedWaiver);
      setShowSuccess(true);
    } catch (error) {
      console.error("Error saving waiver:", error);
      setError(error.message || "Failed to save waiver");
      if (error.message.includes("authentication")) {
        router.push("/login");
      }
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    router.push("/saved-image-waivers");
  };

  return (
    <main className={styles.container}>
      <ImageWaiverForm onSave={handleSaveWaiver} />

      {showSuccess && (
        <PopUpModal
          message="Waiver saved successfully!"
          onConfirm={handleCloseSuccess}
          onCancel={handleCloseSuccess}
        />
      )}

      {error && (
        <PopUpModal
          message={error}
          onConfirm={() => setError(null)}
          onCancel={() => setError(null)}
        />
      )}
    </main>
  );
}
