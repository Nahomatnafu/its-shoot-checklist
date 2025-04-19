"use client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  
  // Using replace directly instead of useEffect for a simpler implementation
  router.replace("/login");
  
  return null;
}
