"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../../../styles/Credits.module.css";
import useCreditStore from "../../store/useCreditStore";
import PopUpModal from "../../../components/PopUpModal";

export default function CreateCredits() {
  const router = useRouter();
  const { addCredit } = useCreditStore();

  const [projectName, setProjectName] = useState("");
  const [roles, setRoles] = useState([
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
  ]);

  const [showModal, setShowModal] = useState(false); // ✅ For success modal
  const [modalMessage, setModalMessage] = useState("");

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

  const handleSubmit = () => {
    try {
      const newCredit = { 
        projectName: projectName.trim(), 
        roles: roles 
      };
      
      addCredit(newCredit);
      setModalMessage("Credits saved successfully!");
      setShowModal(true);
    } catch (error) {
      setModalMessage(error.message);
      setShowModal(true);
    }
  };

  // When user clicks "Save" in the modal
  const confirmAndRedirect = () => {
    setShowModal(false);
    router.push("/credits"); // ✅ Redirect manually after confirmation
  };

  return (
    <div className={styles.creditsWrapper}>
      <h2 className={styles.title}>Create New Credits</h2>
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
                    onChange={(e) =>
                      handleRoleChange(roleIndex, e.target.value)
                    }
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

        <button className={styles.submitButton} onClick={addRole}>
          ➕ Add Custom Role
        </button>
        <button className={styles.submitButton} onClick={handleSubmit}>
          Save Credits
        </button>

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
          onConfirm={confirmAndRedirect}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
