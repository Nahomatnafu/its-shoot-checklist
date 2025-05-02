"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useCreditStore from "../../store/useCreditStore";
import styles from "../../../../styles/Credits.module.css";
import PopUpModal from "../../../components/PopUpModal";

const defaultRoles = [
  { role: "Director/Coordinator", people: [""] },
  { role: "Written by", people: [""] },
  { role: "Camera Operators", people: [""] },
  { role: "Set assistants", people: [""] },
  { role: "Audio Recording", people: [""] },
  { role: "Video Editor", people: [""] },
  { role: "Visual Effects", people: [""] },
  { role: "Audio Mixing", people: [""] },
  { role: "Colorist", people: [""] },
  { role: "Captioned by", people: [""] },
];

export default function CreditDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getCreditById, setCredits, updateCreditById } = useCreditStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [roles, setRoles] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    let controller;
    let timeoutId;
    
    try {
      // Create AbortController only if supported by browser
      controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      timeoutId = setTimeout(() => {
        if (controller) controller.abort();
      }, 8000);
    } catch (error) {
      console.error('AbortController error:', error);
    }

    const loadCredit = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First check if we already have the credit in store
        const cachedCredit = getCreditById(id);
        
        if (cachedCredit) {
          initializeForm(cachedCredit);
          setLoading(false);
          return;
        }
        
        // If not in store, load all credits (with timeout)
        await setCredits(controller?.signal);
        const credit = getCreditById(id);
        
        if (credit) {
          initializeForm(credit);
        } else {
          console.error('Credit not found:', id);
          setError('Credit not found');
        }
      } catch (error) {
        console.error('Error loading credit:', error);
        setError(error.name === 'AbortError' 
          ? 'Request timed out. Please try again.' 
          : error.message || 'Failed to load credit');
      } finally {
        setLoading(false);
        if (timeoutId) clearTimeout(timeoutId);
      }
    };

    const initializeForm = (credit) => {
      setProjectName(credit.projectName);
      
      // Merge existing roles with default roles
      const existingRoleNames = credit.roles.map(r => r.role);
      const mergedRoles = [...credit.roles];
      
      defaultRoles.forEach(defaultRole => {
        if (!existingRoleNames.includes(defaultRole.role)) {
          mergedRoles.push({ ...defaultRole });
        }
      });

      // Ensure each role has at least one empty person field
      const rolesWithPeople = mergedRoles.map(role => ({
        ...role,
        people: role.people.length > 0 ? role.people : [""]
      }));
      
      setRoles(rolesWithPeople);
    };

    loadCredit();
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (controller) controller.abort();
    };
  }, [id, getCreditById, setCredits]);

  const handleSave = async () => {
    try {
      if (!projectName.trim()) {
        setModalMessage("Project name is required");
        setShowModal(true);
        return;
      }

      setIsSaving(true);
      await updateCreditById(id, {
        projectName,
        roles  // Send all roles, even empty ones
      });
      setModalMessage("Credits updated successfully!");
      setShowModal(true);
      setIsSaving(false);
    } catch (error) {
      setIsSaving(false);
      setModalMessage(error.message || "Failed to update credits");
      setShowModal(true);
    }
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    if (!modalMessage.includes("Failed")) {
      router.push("/credits");
    }
  };

  // Add early return for loading state
  if (loading) return <div className={styles.loading}>Loading credit details...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  const addRole = () => {
    setRoles([...roles, { role: "", people: [""] }]);
  };

  const addPerson = (roleIndex) => {
    const newRoles = [...roles];
    newRoles[roleIndex].people.push("");
    setRoles(newRoles);
  };

  const removePerson = (roleIndex, personIndex) => {
    const newRoles = [...roles];
    newRoles[roleIndex].people = newRoles[roleIndex].people.filter(
      (_, i) => i !== personIndex
    );
    setRoles(newRoles);
  };

  const removeRole = (index) => {
    setRoles(roles.filter((_, i) => i !== index));
  };

  const handleRoleChange = (index, value) => {
    const newRoles = [...roles];
    newRoles[index].role = value;
    setRoles(newRoles);
  };

  const handlePersonChange = (roleIndex, personIndex, value) => {
    const newRoles = [...roles];
    newRoles[roleIndex].people[personIndex] = value;
    setRoles(newRoles);
  };

  const validateForm = () => {
    if (!projectName.trim()) {
      throw new Error("Project name is required");
    }
  };

  if (loading) {
    return (
      <div className={styles.creditsWrapper}>
        <div className={styles.loadingSpinner}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.creditsWrapper}>
        <div className={styles.error}>
          <h2>Error: {error}</h2>
          <button 
            className={styles.backButton}
            onClick={() => router.push("/credits")}
          >
            Back to Credits
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.creditsWrapper}>
      <h2 className={styles.title}>Edit Credits</h2>

      <div className={styles.form}>
        <input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className={styles.input}
        />

        <div className={styles.rolesContainer}>
          {roles.map((role, roleIndex) => (
            <div key={roleIndex} className={styles.roleItem}>
              <div className={styles.roleHeader}>
                <div className={styles.inputWithIcons}>
                  <input
                    type="text"
                    placeholder="Role"
                    value={role.role}
                    onChange={(e) => handleRoleChange(roleIndex, e.target.value)}
                    className={styles.input}
                  />
                  <button
                    className={`${styles.iconButton} ${styles.removeRoleIcon}`}
                    onClick={() => removeRole(roleIndex)}
                    title="Remove Role"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {role.people.map((person, personIndex) => (
                <div key={personIndex} className={styles.personContainer}>
                  <div className={styles.inputWithIcons}>
                    <input
                      type="text"
                      list="contributors"
                      placeholder="Person"
                      value={person}
                      onChange={(e) => handlePersonChange(roleIndex, personIndex, e.target.value)}
                      className={styles.input}
                    />
                    <button
                      className={`${styles.iconButton} ${styles.addPersonIcon}`}
                      onClick={() => addPerson(roleIndex)}
                      title="Add Person"
                    >
                      ➕
                    </button>
                    <button
                      className={`${styles.iconButton} ${styles.removePersonIcon}`}
                      onClick={() => removePerson(roleIndex, personIndex)}
                      title="Remove Person"
                    >
                      −
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className={styles.buttonContainer}>
          <button className={styles.submitButton} onClick={addRole}>
            ➕ Add Custom Role
          </button>
          <button className={styles.submitButton} onClick={handleSave}>
            Save Changes
          </button>
          <button 
            className={`${styles.submitButton} ${styles.cancelButton}`}
            onClick={() => router.push("/credits")}
          >
            Cancel
          </button>
        </div>

        <datalist id="contributors">
          {[
            "Connor Kulas",
            "Derick Franklin",
            "Fabio Castel Garcia",
            "Isabelle Linden",
            "Kathryn Petzel",
            "Lilly Anderson",
            "Nahom Atnafu",
            "Omar Elkenawy",
            "Rajesh Karki",
          ]
            .sort()
            .map((name) => (
              <option key={name} value={name} />
            ))}
        </datalist>
      </div>

      {showModal && (
        <PopUpModal
          message={modalMessage}
          onConfirm={handleModalConfirm}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
