import { Inter } from "next/font/google";
import styles from "../../styles/globals.css";
import Header from "@/components/Header";
import RoutePrefetcher from "@/components/RoutePrefetcher";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "Shoot Checklist App",
  description: "Organize and manage shoot equipment",
  icons: {
    icon: [
      {
        url: "/MSU_Logo5.png",
        sizes: "any",
        type: "image/png",
      }
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <RoutePrefetcher />
        <Header />
        {children}
      </body>
    </html>
  );
}



