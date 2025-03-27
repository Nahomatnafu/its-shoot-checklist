"use client";
import styles from "../../styles/Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear(); // ✅ Dynamically get current year

  return (
    <footer className={styles.footer}>
      <p>© {currentYear} ITS Shoot Checklist - V01. All rights reserved.</p>
    </footer>
  );
}
