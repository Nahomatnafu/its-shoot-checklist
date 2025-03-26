"use client";
import styles from "./Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear(); // ✅ Dynamically get current year

  return (
    <footer className={styles.footer}>
      <p>© {currentYear} ITS Shoot Checklist. All rights reserved.</p>
    </footer>
  );
}
