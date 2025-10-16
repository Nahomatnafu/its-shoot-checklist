"use client";
import styles from "../../styles/ImageWaiver.module.css";
import React, { useState, useRef, useEffect } from "react";

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

  const [isClient, setIsClient] = useState(false);
  const waiverRef = useRef();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const downloadPDF = async () => {
    if (!isClient || typeof window === 'undefined') return;
    
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      
      const element = waiverRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      const fileName = formState.name 
        ? `Image_Waiver_${formState.name.replace(/\s+/g, '_')}.pdf`
        : 'Image_Waiver.pdf';
      
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

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
    
    // Only validate name field
    const requiredFields = ['name'];
    const missingFields = requiredFields.filter(field => !formState[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in required fields: ${missingFields.join(', ')}`);
      return;
    }

    if (onSave) {
      onSave(formState);
    }
  };

  return (
    <div className={styles.waiverWrapper}>
      <div ref={waiverRef} className={styles.waiverContainer}>
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

        {!readOnly ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              name="projectName"
              value={formState.projectName}
              onChange={handleChange}
              placeholder="Project/Event Name (optional)"
              className={styles.input}
              readOnly={readOnly}
            />
            <input
              type="date"
              name="projectDate"
              value={formState.projectDate}
              onChange={handleChange}
              placeholder="Project/Event Date (optional)"
              className={styles.input}
              readOnly={readOnly}
            />
            <input
              name="name"
              value={formState.name}
              onChange={handleChange}
              placeholder="Name (required)"
              className={`${styles.input} ${styles.required}`}
              readOnly={readOnly}
              required
            />
            <input
              name="address"
              value={formState.address}
              onChange={handleChange}
              placeholder="Address (optional)"
              className={styles.input}
              readOnly={readOnly}
            />
            <input
              name="phone"
              value={formState.phone}
              onChange={handleChange}
              placeholder="Phone (optional)"
              className={styles.input}
              readOnly={readOnly}
            />
            <div className={styles.row}>
              <input
                name="city"
                value={formState.city}
                onChange={handleChange}
                placeholder="City (optional)"
                className={styles.cityInput}
                readOnly={readOnly}
              />
              <input
                name="state"
                value={formState.state}
                onChange={handleChange}
                placeholder="State (optional)"
                className={styles.stateInput}
                readOnly={readOnly}
              />
              <input
                name="zip"
                value={formState.zip}
                onChange={handleChange}
                placeholder="Zip (optional)"
                className={styles.zipInput}
                readOnly={readOnly}
              />
            </div>
            <input
              name="signature"
              value={formState.signature}
              onChange={handleChange}
              placeholder="Signature (optional)"
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
              placeholder="Parent/Guardian Name (optional)"
              className={styles.input}
              readOnly={readOnly}
            />
            <input
              name="parentSignature"
              value={formState.parentSignature}
              onChange={handleChange}
              placeholder="Parent/Guardian Signature (optional)"
              className={styles.input}
              readOnly={readOnly}
            />
            <input
              name="parentSignatureDate"
              value={formState.parentSignatureDate}
              onChange={handleChange}
              placeholder="Parent/Guardian Signature Date (optional)"
              className={styles.input}
              readOnly={readOnly}
            />
            <div className={styles.buttonContainer}>
              <button type="submit" className={styles.submitButton}>
                Submit Waiver
              </button>
            </div>
          </form>
        ) : (
          <div className={styles.displayContainer}>
            {formState.projectName && (
              <div className={styles.displayField}>
                <strong>Project/Event Name:</strong> {formState.projectName}
              </div>
            )}
            {formState.projectDate && (
              <div className={styles.displayField}>
                <strong>Project/Event Date:</strong> {formState.projectDate}
              </div>
            )}
            {formState.name && (
              <div className={styles.displayField}>
                <strong>Name:</strong> {formState.name}
              </div>
            )}
            {formState.address && (
              <div className={styles.displayField}>
                <strong>Address:</strong> {formState.address}
              </div>
            )}
            {formState.phone && (
              <div className={styles.displayField}>
                <strong>Phone:</strong> {formState.phone}
              </div>
            )}
            {(formState.city || formState.state || formState.zip) && (
              <div className={styles.displayField}>
                <strong>City/State/Zip:</strong> {formState.city} {formState.state} {formState.zip}
              </div>
            )}
            {formState.signature && (
              <div className={styles.displayField}>
                <strong>Signature:</strong> {formState.signature}
              </div>
            )}
            {formState.date && (
              <div className={styles.displayField}>
                <strong>Date:</strong> {new Date(formState.date).toLocaleDateString()}
              </div>
            )}
            <hr className={styles.separator} />
            <h2 className={styles.subTitle}>If under 18:</h2>
            {formState.parentName && (
              <div className={styles.displayField}>
                <strong>Parent/Guardian Name:</strong> {formState.parentName}
              </div>
            )}
            {formState.parentSignature && (
              <div className={styles.displayField}>
                <strong>Parent/Guardian Signature:</strong> {formState.parentSignature}
              </div>
            )}
            {formState.parentSignatureDate && (
              <div className={styles.displayField}>
                <strong>Parent/Guardian Signature Date:</strong> {formState.parentSignatureDate}
              </div>
            )}
          </div>
        )}
      </div>
      {readOnly && isClient && (
        <div className={styles.buttonContainer}>
          <button
            onClick={downloadPDF}
            className={styles.downloadButton}
            type="button"
          >
            📄 Download PDF
          </button>
        </div>
      )}
    </div>
  );
}
