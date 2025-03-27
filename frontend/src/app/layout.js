import { Geist, Geist_Mono } from "next/font/google";
import styles from "../../styles/globals.css";

import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Shoot Checklist App",
  description: "Organize and manage shoot equipment",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header /> {/* Header will decide when to hide itself */}
        {children}
      </body>
    </html>
  );
}
