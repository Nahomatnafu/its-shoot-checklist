"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ImageWaiverForm from "@/components/ImageWaiverForm";
import PopUpModal from "@/components/PopUpModal"; // ✅ Import modal
import styles from "../../../styles/ImageWaiver.module.css";

export default function ImageWaiverPage() {
  const [waivers, setWaivers] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedWaivers = JSON.parse(localStorage.getItem("savedWaivers")) || [];
    setWaivers(savedWaivers);
  }, []);

  const handleSaveWaiver = (formData) => {
    const updatedWaivers = [...waivers, formData];
    localStorage.setItem("savedWaivers", JSON.stringify(updatedWaivers));
    setWaivers(updatedWaivers);
    setShowSuccess(true); // ✅ Show success modal
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    router.push("/saved-image-waivers"); // ✅ Redirect after modal close
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
    </main>
  );
}
