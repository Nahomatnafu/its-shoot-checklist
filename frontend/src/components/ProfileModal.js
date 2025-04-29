"use client";
import { useState, useEffect } from "react";
import { FaUpload } from "react-icons/fa";
import styles from "../../styles/ProfileModal.module.css";

export default function ProfileModal({ isOpen, onClose, user, onUpdate }) {
  const [formData, setFormData] = useState({
    activeModal: "main",
    currentPassword: "",
    newPassword: "",
    position: "",
    profilePic: "",
    error: ""
  });
  const [previewImage, setPreviewImage] = useState(null); // New state for newly uploaded image preview

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      position: user?.position || "No Position",
      profilePic: user?.profilePic || ""
    }));
  }, [user]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user._id,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          position: formData.position,
          profilePic: previewImage || formData.profilePic // Use new uploaded image if available
        })
      });

      const data = await response.json();

      if (response.ok) {
        onUpdate(data.user);
        onClose();
        setFormData(prev => ({ ...prev, activeModal: "main", error: "" }));
        setPreviewImage(null);
      } else {
        setFormData(prev => ({ ...prev, error: data.message }));
      }
    } catch (error) {
      setFormData(prev => ({ ...prev, error: "Failed to update profile" }));
    }
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
      {formData.error && <p className={styles.error}>{formData.error}</p>}
      <input
        type="password"
        placeholder="Current Password"
        value={formData.currentPassword}
        onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
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
      {!previewImage ? (
        <label className={styles.uploadLabel}>
          <FaUpload className={styles.uploadIcon} />
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (file) {
                try {
                  const token = localStorage.getItem('authToken');
                  if (!token) {
                    throw new Error('No authentication token found');
                  }

                  const formDataUpload = new FormData();
                  formDataUpload.append("image", file);

                  const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/profile`, {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${token}`
                    },
                    body: formDataUpload
                  });

                  if (!uploadResponse.ok) {
                    const errorData = await uploadResponse.json();
                    throw new Error(errorData.message || 'Upload failed');
                  }

                  const uploadResult = await uploadResponse.json();
                  
                  setPreviewImage(uploadResult.imageUrl);
                  setFormData(prev => ({
                    ...prev,
                    profilePic: uploadResult.imageUrl,
                    error: ""
                  }));

                } catch (error) {
                  console.error('Upload error:', error);
                  setFormData(prev => ({
                    ...prev,
                    error: error.message || "Failed to upload image"
                  }));
                }
              }
            }}
            className={styles.fileInput}
          />
        </label>
      ) : (
        <img 
          src={previewImage}
          alt="Preview"
          className={styles.previewImage}
        />
      )}
      {formData.error && <p className={styles.error}>{formData.error}</p>}
      {previewImage && (
        <button onClick={handleSave} className={styles.saveButton} style={{ marginTop: "1rem" }}>
          Save
        </button>
      )}
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
