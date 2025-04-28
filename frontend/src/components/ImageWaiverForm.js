"use client";
import styles from "../../styles/ImageWaiver.module.css";
import React, { useState } from "react";

export default function ImageWaiverForm({
  onSave,
  formData = {},
  readOnly = false,
}) {
  const [formState, setFormState] = useState({
    projectName: "",
    projectDate: "",
    name: "",
    address: "",
    phone: "",
    city: "",
    state: "",
    zip: "",
    date: new Date().toLocaleDateString(),
    signature: "",
    parentName: "",
    parentSignature: "",
    parentSignatureDate: "",
    ...formData, // Pre-fill with saved data if available
  });

  const handleChange = (e) => {
    if (!readOnly) {
      let { name, value } = e.target;

      // 📞 Auto-format phone number: 5078008901 → 507-800-8901
      if (name === "phone") {
        value = value.replace(/\D/g, "").slice(0, 10); // Only digits, max 10
        if (value.length >= 7) {
          value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`;
        } else if (value.length >= 4) {
          value = `${value.slice(0, 3)}-${value.slice(3)}`;
        }
      }

      setFormState((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['projectName', 'projectDate', 'name', 'address', 'phone', 'city', 'state', 'zip', 'signature'];
    const missingFields = requiredFields.filter(field => !formState[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    if (onSave) {
      onSave(formState);
    }
  };

  return (
    <div className={styles.waiverWrapper}>
      <div className={styles.waiverContainer}>
        <div className={styles.logoContainer}>
          <img
            src="/minnesota_state_logo.png"
            alt="Minnesota State Logo"
            className={styles.logo}
          />
        </div>
        <h1 className={styles.title}>Image Release and Waiver</h1>

        <p className={styles.paragraph}>
          I hereby grant the Board of Trustees of the Minnesota State Colleges
          and Universities (“Minnesota State”) permission to reproduce my name,
          likeness, identity, voice, photographic image, videographic image, and
          oral or recorded statements (hereinafter “Recordings”) from Minnesota
          State University, Mankato in any publication by Minnesota State
          intended for educational, promotional, fund-raising, storytelling or
          other related use, including public display on webpages and web-based
          publications. I consent to the public release of the Recordings for
          the above-stated purposes, pursuant to the consent provisions of the
          Minnesota Government Data Practices Act (Minnesota Statutes Chapter
          13) and/or the Family Educational Rights and Privacy Act, 20 U.S.C.
          1232 et seq., if applicable.
        </p>

        <p className={styles.paragraph}>
          By signing this form, I hereby waive and release Minnesota State and
          its officers, agents, and employees, from any claim or liability
          relating to the use of my name, likeness, identity, voice,
          photographic image, videographic image, and oral or recorded
          statements. I hereby waive any right that I may have to inspect or
          approve the finished Recordings. I understand that the Recordings and
          copyright will be the sole property of Minnesota State. I understand I
          may refuse to be photographed or otherwise recorded, and that there
          are no known consequences of my refusal to do so.
        </p>

        <p className={styles.paragraph}>
          I acknowledge that Minnesota State will rely on this waiver and
          release in producing, broadcasting, and distributing materials
          containing my name, likeness, identity, voice, photographic image,
          videographic image or oral or recorded statements, and that I will
          receive no money or remuneration of any kind from Minnesota State
          related to the Recordings.
        </p>

        <p className={styles.paragraph}>
          I acknowledge and represent that I am over the age of 18, have read
          this entire document, that I understand the contents, meaning, and
          impact of this waiver and release, and that I have signed it knowingly
          and voluntarily on behalf of myself and/or my minor children (if
          applicable). I understand that I may revoke this consent at any time.
          This consent expires upon completion of the stated purpose for the
          Recordings or upon written notice that you revoke your consent,
          whichever comes first.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            name="projectName"
            value={formState.projectName}
            onChange={handleChange}
            placeholder="Project/Event Name"
            className={styles.input}
            readOnly={readOnly}
          />
          <input
            type="date" // 🔁 change from type="text"
            name="projectDate"
            value={formState.projectDate}
            onChange={handleChange}
            placeholder="Project/Event Date"
            className={styles.input}
            readOnly={readOnly}
          />
          <input
            name="name"
            value={formState.name}
            onChange={handleChange}
            placeholder="Name"
            className={styles.input}
            readOnly={readOnly}
          />
          <input
            name="address"
            value={formState.address}
            onChange={handleChange}
            placeholder="Address"
            className={styles.input}
            readOnly={readOnly}
          />
          <input
            name="phone"
            value={formState.phone}
            onChange={handleChange}
            placeholder="Phone"
            className={styles.input}
            readOnly={readOnly}
          />
          <div className={styles.row}>
            <input
              name="city"
              value={formState.city}
              onChange={handleChange}
              placeholder="City"
              className={styles.cityInput}
              readOnly={readOnly}
            />
            <input
              name="state"
              value={formState.state}
              onChange={handleChange}
              placeholder="State"
              className={styles.stateInput}
              readOnly={readOnly}
            />
            <input
              name="zip"
              value={formState.zip}
              onChange={handleChange}
              placeholder="Zip"
              className={styles.zipInput}
              readOnly={readOnly}
            />
          </div>
          <input
            name="signature"
            value={formState.signature}
            onChange={handleChange}
            placeholder="Signature (Full Name or Initials)"
            className={styles.input}
            readOnly={readOnly}
          />
          <input
            name="date"
            value={formState.date}
            onChange={handleChange}
            placeholder="Date"
            className={styles.input}
            readOnly={readOnly}
          />
          <hr className={styles.separator} />
          <h2 className={styles.subTitle}>If under 18:</h2>
          <input
            name="parentName"
            value={formState.parentName}
            onChange={handleChange}
            placeholder="Parent/Guardian Name"
            className={styles.input}
            readOnly={readOnly}
          />
          <input
            name="parentSignature"
            value={formState.parentSignature}
            onChange={handleChange}
            placeholder="Parent/Guardian Signature (Full Name or Initials)"
            className={styles.input}
            readOnly={readOnly}
          />
          <input
            name="parentSignatureDate"
            value={formState.parentSignatureDate}
            onChange={handleChange}
            placeholder="Parent/Guardian Signature Date"
            className={styles.input}
            readOnly={readOnly}
          />
          {!readOnly && (
            <button type="submit" className={styles.submitButton}>
              Submit Waiver
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
