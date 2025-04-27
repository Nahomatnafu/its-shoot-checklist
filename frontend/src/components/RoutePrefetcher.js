"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RoutePrefetcher() {
  const router = useRouter();
  
  useEffect(() => {
    router.prefetch('/dashboard')
    router.prefetch('/shoots')
    router.prefetch('/image-waiver')
  }, [router]);

  return null;
}