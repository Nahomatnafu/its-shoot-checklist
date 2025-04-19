import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAdminAuth() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.role !== "admin") {
      router.replace("/dashboard");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  return isAuthorized;
}