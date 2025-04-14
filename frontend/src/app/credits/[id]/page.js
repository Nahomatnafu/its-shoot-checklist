"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useCreditStore from "../../store/useCreditStore";
import styles from "../../../../styles/Credits.module.css";

export default function CreditDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getCreditById, updateCreditById } = useCreditStore();

  const [projectName, setProjectName] = useState("");
  const [roles, setRoles] = useState([]);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    const credit = getCreditById(id);
    if (credit) {
      setProjectName(credit.projectName);
      setRoles(credit.roles);
    } else {
      router.replace("/credits");
    }
  }, [id]);

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
    updateCreditById(id, {
      id,
      projectName,
      roles,
    });
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
    </div>
  );
}
