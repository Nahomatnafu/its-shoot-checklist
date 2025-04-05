  "use client";

  import { useState, useEffect } from "react";
  import { useRouter } from "next/navigation";
  import styles from "../../../styles/SavedImageWaivers.module.css";

  export default function SavedImageWaivers() {
    const [waivers, setWaivers] = useState([]);
    const router = useRouter();

    useEffect(() => {
      const savedWaivers = JSON.parse(localStorage.getItem("savedWaivers")) || [];
      setWaivers(savedWaivers);
    }, []);

    const handleDelete = (index) => {
      if (confirm("Are you sure you want to delete this waiver?")) {
        const updatedWaivers = waivers.filter((_, i) => i !== index);
        localStorage.setItem("savedWaivers", JSON.stringify(updatedWaivers));
        setWaivers(updatedWaivers);
      }
    };

    return (
      <main className={styles.container}>
        <h1 className={styles.heading}>Saved Image Waivers</h1>

        {waivers.length === 0 ? (
          <p className={styles.noWaivers}>No saved image waivers.</p>
        ) : (
          <ul className={styles.waiverList}>
            {waivers.map((waiver, index) => (
              <li
                key={index}
                className={styles.waiverCard}
                onClick={() => router.push(`/saved-image-waivers/${index}`)} // Make it clickable
              >
                <div className={styles.waiverInfo}>
                  📑 {waiver.projectName} - {waiver.name} - {waiver.date}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click from triggering
                    handleDelete(index);
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
