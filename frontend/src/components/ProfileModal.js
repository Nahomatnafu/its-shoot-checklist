"use client";
import { useState, useEffect } from "react";
import { FaUpload } from "react-icons/fa";
import styles from "../../styles/ProfileModal.module.css";

export default function ProfileModal({ isOpen, onClose, user, onUpdate }) {
  const [activeModal, setActiveModal] = useState("main");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [position, setPosition] = useState("");
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    setPosition(user?.position || "No Position");
  }, [user]);

  const handleSave = () => {
    const updatedUser = {
      ...user,
      position,
      password: newPassword || user.password,
      profilePic: profilePic || user.profilePic,
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    onUpdate(updatedUser);
    onClose();
    setActiveModal("main");
  };

  if (!isOpen) return null;

  const renderMainContent = () => (
    <div className={styles.modalContent}>
      <h2 className={styles.userName}>{user?.name}</h2>
      <p
        className={styles.userPosition}
        onClick={() => setActiveModal("position")}
      >
        {position} ▼
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
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={styles.input}
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
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
        value={position}
        onChange={(e) => setPosition(e.target.value)}
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
            setProfilePic(URL.createObjectURL(e.target.files[0]))
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
      {activeModal === "main" && renderMainContent()}
      {activeModal === "password" && renderPasswordContent()}
      {activeModal === "position" && renderPositionContent()}
      {activeModal === "picture" && renderPictureContent()}
      <button onClick={onClose} className={styles.closeButton}>
        ✖
      </button>
    </div>
  );
}
