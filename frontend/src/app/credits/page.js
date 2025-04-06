"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../../../styles/Credits.module.css";

export default function SavedCredits() {
  const [credits, setCredits] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editProjectName, setEditProjectName] = useState("");
  const [editRoles, setEditRoles] = useState([]);
  const [saveMessage, setSaveMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const savedCredits = JSON.parse(localStorage.getItem("credits")) || [];
    setCredits(savedCredits);
  }, []);

  const handleDelete = (index) => {
    if (confirm("Are you sure you want to delete this credit?")) {
      const updatedCredits = credits.filter((_, i) => i !== index);
      localStorage.setItem("credits", JSON.stringify(updatedCredits));
      setCredits(updatedCredits);
      setSaveMessage("Credit deleted successfully!");
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditProjectName(credits[index].projectName);
    setEditRoles([...credits[index].roles]);
  };

  const handleSaveEdit = () => {
    const updatedCredits = [...credits];
    updatedCredits[editingIndex] = {
      projectName: editProjectName,
      roles: editRoles,
    };
    localStorage.setItem("credits", JSON.stringify(updatedCredits));
    setCredits(updatedCredits);
    setEditingIndex(null);
    setSaveMessage("Credit updated successfully!");
  };

  const handleRoleChange = (index, value) => {
    const updatedRoles = [...editRoles];
    updatedRoles[index].role = value;
    setEditRoles(updatedRoles);
  };

  const handlePersonChange = (roleIndex, personIndex, value) => {
    const updatedRoles = [...editRoles];
    updatedRoles[roleIndex].people[personIndex] = value;
    setEditRoles(updatedRoles);
  };

  return (
    <div className={styles.creditsWrapper}>
      <h2 className={styles.title}>Saved Credits</h2>

      {saveMessage && <p className={styles.saveMessage}>{saveMessage}</p>}

      {credits.length === 0 ? (
        <p className={styles.noCredits}>No saved credits available.</p>
      ) : (
        credits.map((credit, index) => (
          <div key={index} className={styles.creditCard}>
            {editingIndex === index ? (
              <div className={styles.editForm}>
                <input
                  type="text"
                  value={editProjectName}
                  onChange={(e) => setEditProjectName(e.target.value)}
                  className={styles.input}
                />
                {editRoles.map((role, roleIndex) => (
                  <div key={roleIndex} className={styles.roleContainer}>
                    <input
                      type="text"
                      value={role.role}
                      onChange={(e) =>
                        handleRoleChange(roleIndex, e.target.value)
                      }
                      className={styles.input}
                    />
                    {role.people.map((person, personIndex) => (
                      <input
                        key={personIndex}
                        type="text"
                        value={person}
                        onChange={(e) =>
                          handlePersonChange(
                            roleIndex,
                            personIndex,
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    ))}
                  </div>
                ))}
                <button className={styles.saveButton} onClick={handleSaveEdit}>
                  Save Changes
                </button>
              </div>
            ) : (
              <>
                <h3 className={styles.projectName}>{credit.projectName}</h3>
                {credit.roles.map((role, roleIndex) => (
                  <p key={roleIndex} className={styles.role}>
                    <strong>{role.role}:</strong> {role.people.join(", ")}
                  </p>
                ))}
                <div className={styles.actionButtons}>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEdit(index)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}
