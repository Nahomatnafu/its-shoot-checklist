"use client";
import React from "react";
import styles from "../../styles/PopUpModal.module.css";

export default function PopUpModal({
  message,
  onConfirm,
  onCancel,
  showInput = false,
  inputValue = "",
  onInputChange = () => {},
}) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onCancel}>
          ×
        </button>
        <p className={styles.modalMessage}>{message}</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onConfirm();
          }}
        >
          {showInput ? (
            <input
              className={styles.input}
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="Enter title..."
              autoFocus
            />
          ) : (
            // 👇 This ensures Enter key still works without visible input
            <input type="text" style={{ height: 0, opacity: 0 }} autoFocus />
          )}

          <button type="submit" className={styles.saveButton}>
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
