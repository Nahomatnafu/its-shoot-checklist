"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useShootStore from "../../store/useShootStore";
import PopUpModal from "../../../components/PopUpModal";
import styles from "../../../../styles/ShootTypePage.module.css";

export default function ShootDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const { getShootById, fetchShootById, updateShootById } = useShootStore();
  const [shoot, setShoot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedChecklist, setEditedChecklist] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    // Add AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    async function loadShoot() {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        // First try to get from store (instant)
        let foundShoot = getShootById(id);

        if (foundShoot) {
          setShoot(foundShoot);
          setEditedChecklist(foundShoot.checklist || {});
          setLoading(false);
        } else {
          // If not in store, fetch with timeout
          const fetchedShoot = await fetchShootById(id, controller.signal);
          setShoot(fetchedShoot);
          setEditedChecklist(fetchedShoot.checklist || {});
        }
      } catch (error) {
        console.error("Failed to fetch shoot:", error);
        setError(error.name === 'AbortError'
          ? 'Request timed out. Please try again.'
          : error.message || "Failed to load shoot");
      } finally {
        setLoading(false);
        clearTimeout(timeoutId);
      }
    }

    loadShoot();

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [id, getShootById, fetchShootById]);

  const handleCheckboxChange = (itemName) => {
    setEditedChecklist((prev) => ({
      ...prev,
      [itemName]: {
        takeOut: !prev[itemName]?.takeOut,
      },
    }));
  };

  const handleSave = async () => {
    try {
      await updateShootById(id, {
        ...shoot,
        checklist: editedChecklist,
      });

      setShoot((prev) => ({
        ...prev,
        checklist: editedChecklist,
      }));

      setIsEditMode(false);
      setModalMessage("Shoot updated successfully!");
      setShowModal(true);
    } catch (error) {
      console.error("Error updating shoot:", error);
      setModalMessage("Failed to update shoot. Please try again.");
      setShowModal(true);
    }
  };

  const handleCancelEdit = () => {
    setEditedChecklist(shoot.checklist || {});
    setIsEditMode(false);
  };

  // Add early return for loading state
  if (loading) return <div className={styles.loading}>Loading shoot details...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!shoot) return <div className={styles.error}>Shoot not found</div>;

  return (
    <main className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 className={styles.heading}>📝 {shoot.title}</h1>
        {!isEditMode ? (
          <button
            onClick={() => setIsEditMode(true)}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#febd11',
              color: 'black',
              border: '2px solid #49306e',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
            }}
          >
            Edit Shoot
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleSave}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: '2px solid #49306e',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              Save Changes
            </button>
            <button
              onClick={handleCancelEdit}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f44336',
                color: 'white',
                border: '2px solid #49306e',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className={styles.grid}>
        {shoot.template?.map((category, index) => (
          <div key={index} className={styles.categoryWrapper}>
            <div
              className={`${styles.category} ${
                index % 2 === 0 ? styles.yellow : styles.purple
              }`}
            >
              <h2 className={styles.categoryTitle}>{category.name}</h2>
            </div>

            <div className={styles.items}>
              {category.items.map((item, i) => {
                const isChecked = isEditMode
                  ? editedChecklist[item.name]?.takeOut || false
                  : shoot.checklist?.[item.name]?.takeOut || false;

                return (
                  <div
                    key={i}
                    className={`${styles.item} ${
                      isChecked ? "text-green-600" : "text-red-600"
                    }`}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    {isEditMode ? (
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCheckboxChange(item.name)}
                        style={{
                          width: '1.2rem',
                          height: '1.2rem',
                          cursor: 'pointer',
                          accentColor: '#febd11'
                        }}
                      />
                    ) : (
                      <span>{isChecked ? "✅" : "❌"}</span>
                    )}
                    <span className={styles.itemText}>{item.name}</span>
                    {item.optional && (
                      <span className={styles.optional}>(Optional)</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <PopUpModal
          message={modalMessage}
          onConfirm={() => setShowModal(false)}
          onCancel={() => setShowModal(false)}
        />
      )}
    </main>
  );
}
