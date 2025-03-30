"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ImageWaiverForm from "@/components/ImageWaiverForm";
import styles from "../../../styles/ImageWaiver.module.css";

export default function ImageWaiverPage() {
  const [waivers, setWaivers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const savedWaivers = JSON.parse(localStorage.getItem("savedWaivers")) || [];
    setWaivers(savedWaivers);
  }, []);

  const handleSaveWaiver = (formData) => {
    const updatedWaivers = [...waivers, formData];
    localStorage.setItem("savedWaivers", JSON.stringify(updatedWaivers));
    setWaivers(updatedWaivers);
    alert("Waiver saved successfully!");
  };

  return (
    <main className={styles.container}>
      <ImageWaiverForm onSave={handleSaveWaiver} />
    </main>
  );
}
