"use client";

import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // Don't show navbar on login page
  if (pathname === "/login") return null;

  const handleLogout = () => {
    // In future: clear auth token or session
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="font-bold text-lg">🎥 Shoot Checklist</h1>
      <div className="flex gap-4">
        <button onClick={() => router.push("/dashboard")} className="text-purple-600 hover:underline">
          Dashboard
        </button>
        <button onClick={() => router.push("/shoot-types")} className="text-purple-600 hover:underline">
          Choose Shoot Type
        </button>
        <button onClick={handleLogout} className="text-red-500 hover:underline">
          Logout
        </button>
      </div>
    </nav>
  );
}
