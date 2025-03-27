"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ShootsPage() {
  const [shoots, setShoots] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const storedShoots = JSON.parse(localStorage.getItem("savedShoots")) || [];
    setShoots(storedShoots);
  }, []);

  const handleShootClick = (index) => {
    router.push(`/shoots/${index}`);
  };

  return (
    <main className="p-6">
      <h1
        className="text-3xl font-bold mb-6"
        style={{ fontFamily: "Franklin Gothic Medium" }}
      >
        Saved Shoots
      </h1>

      {shoots.length === 0 ? (
        <p className="text-gray-500">No shoots saved yet.</p>
      ) : (
        <ul className="space-y-3">
          {shoots.map((shoot, index) => (
            <li
              key={index}
              onClick={() => handleShootClick(index)}
              className="bg-yellow-100 text-purple-900 font-semibold rounded-lg p-4 cursor-pointer hover:bg-yellow-200 shadow-md transition"
            >
              📸 {shoot.title}{" "}
              <span className="text-sm text-gray-600">({shoot.date})</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
