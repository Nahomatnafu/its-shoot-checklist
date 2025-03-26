"use client";
import { useState, useEffect } from "react";

export default function Shoots() {
  const [shoots, setShoots] = useState([]);

  useEffect(() => {
    const storedShoots = JSON.parse(localStorage.getItem("savedShoots")) || [];
    setShoots(storedShoots);
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Saved Shoots</h1>

      {shoots.length === 0 ? (
        <p>No shoots saved yet.</p>
      ) : (
        <ul>
          {shoots.map((shoot, index) => (
            <li key={index} className="p-4 bg-gray-100 rounded mb-2">
              <strong>
                {shoot.title} ({shoot.date})
              </strong>
              <ul className="mt-2">
                {Object.keys(shoot.checklist).length > 0 ? (
                  Object.entries(shoot.checklist).map(([item, checked]) => (
                    <li
                      key={item}
                      className={checked ? "text-green-600" : "text-red-600"}
                    >
                      {checked ? "✅" : "❌"} {item}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">
                    No checklist items were checked.
                  </li>
                )}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
