"use client";
import { useParams } from "next/navigation";
import checklists from "@/data/checklists";
import ShootTypePage from "@/components/ShootTypePage";
import Footer from "@/components/Footer";


export default function ShootTypeChecklistPage() {
  const { type } = useParams();
  const checklist = checklists[type];

  if (!checklist) {
    return (
      <main className="flex items-center justify-center h-screen bg-red-100">
        <h1 className="text-xl font-bold text-red-700">
          ❌ No checklist found for: {type}
        </h1>
      </main>
    );
  }

  return (
    <>
      <ShootTypePage
        title={checklist.title}
        categories={checklist.categories}
      />
      <Footer />
    </>
  );
}
