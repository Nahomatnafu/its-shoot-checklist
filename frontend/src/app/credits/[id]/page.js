"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "../../../../styles/Credits.module.css";

export default function CreditDetailsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [projectName, setProjectName] = useState("");
  const [roles, setRoles] = useState([]);
  const [saveMessage, setSaveMessage] = useState("");

  // Extract the credit ID from the pathname
  const creditId = parseInt(pathname.split("/").pop(), 10);

  useEffect(() => {
    const savedCredits = JSON.parse(localStorage.getItem("credits")) || [];
    if (savedCredits[creditId]) {
      setProjectName(savedCredits[creditId].projectName);
      setRoles(savedCredits[creditId].roles);
    } else {
      router.replace("/credits");
    }
  }, [creditId, router]);

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

  const handleSave = () => {
    const updatedCredits = JSON.parse(localStorage.getItem("credits")) || [];
    updatedCredits[creditId] = { projectName, roles };
    localStorage.setItem("credits", JSON.stringify(updatedCredits));
    setSaveMessage("Credits updated successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  return (
    <div className={styles.creditsWrapper}>
      <h2 className={styles.title}>Edit Credits</h2>

      {saveMessage && <p className={styles.saveMessage}>{saveMessage}</p>}

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
                    placeholder="Role (e.g., Director)"
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
                      placeholder="Person"
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
        <button className={styles.submitButton} onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
