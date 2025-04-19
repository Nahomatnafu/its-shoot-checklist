"use client";
import { useState, useEffect } from "react";
import { FaUpload } from "react-icons/fa";
import styles from "../../styles/ProfileModal.module.css";

export default function ProfileModal({ isOpen, onClose, user, onUpdate }) {
  const [formData, setFormData] = useState({
    activeModal: "main",
    password: "",
    newPassword: "",
    position: "",
    profilePic: ""
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      position: user?.position || "No Position",
      profilePic: user?.profilePic || ""
    }));
  }, [user]);

  const handleSave = () => {
    const updatedUser = {
      ...user,
      position: formData.position,
      password: formData.newPassword || user.password,
      profilePic: formData.profilePic || user.profilePic
    };
    
    localStorage.setItem("user", JSON.stringify(updatedUser));
    onUpdate(updatedUser);
    onClose();
    setFormData(prev => ({ ...prev, activeModal: "main" }));
  };

  const setActiveModal = (modalName) => {
    setFormData(prev => ({ ...prev, activeModal: modalName }));
  };

  if (!isOpen) return null;

  const renderMainContent = () => (
    <div className={styles.modalContent}>
      <h2 className={styles.userName}>{user?.name}</h2>
      <p
        className={styles.userPosition}
        onClick={() => setActiveModal("position")}
      >
        {formData.position} ▼
      </p>
      <p
        className={styles.modalLink}
        onClick={() => setActiveModal("password")}
      >
        Change Password
      </p>
      <p className={styles.modalLink} onClick={() => setActiveModal("picture")}>
        Change Profile Picture
      </p>
    </div>
  );

  const renderPasswordContent = () => (
    <div className={styles.modalContent}>
      <span className={styles.backArrow} onClick={() => setActiveModal("main")}>
        ←
      </span>
      <input
        type="password"
        placeholder="Old Password"
        value={formData.password}
        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
        className={styles.input}
      />
      <input
        type="password"
        placeholder="New Password"
        value={formData.newPassword}
        onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
        className={styles.input}
      />
      <button onClick={handleSave} className={styles.saveButton}>
        Change Password
      </button>
    </div>
  );

  const renderPositionContent = () => (
    <div className={styles.modalContent}>
      <span className={styles.backArrow} onClick={() => setActiveModal("main")}>
        ←
      </span>
      <input
        type="text"
        placeholder="Enter Position"
        value={formData.position}
        onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
        className={styles.input}
      />
      <button onClick={handleSave} className={styles.saveButton}>
        Update Position
      </button>
    </div>
  );

  const renderPictureContent = () => (
    <div className={styles.modalContent}>
      <span className={styles.backArrow} onClick={() => setActiveModal("main")}>
        ←
      </span>
      <label className={styles.uploadLabel}>
        <FaUpload className={styles.uploadIcon} />
        <input
          type="file"
          onChange={(e) =>
            setFormData(prev => ({ 
              ...prev, 
              profilePic: URL.createObjectURL(e.target.files[0]) 
            }))
          }
          className={styles.fileInput}
        />
      </label>
      <button onClick={handleSave} className={styles.saveButton}>
        Update Picture
      </button>
    </div>
  );

  return (
    <div className={styles.modalOverlay}>
      {formData.activeModal === "main" && renderMainContent()}
      {formData.activeModal === "password" && renderPasswordContent()}
      {formData.activeModal === "position" && renderPositionContent()}
      {formData.activeModal === "picture" && renderPictureContent()}
      <button onClick={onClose} className={styles.closeButton}>
        ✖
      </button>
    </div>
  );
}
