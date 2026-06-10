import { Hero } from "@/app/(store)/(HomePage)/sections/Hero";
import { Destacados } from "@/app/(store)/(HomePage)/sections/Destacados/Destacados";
import { LaMarca } from "@/app/(store)/(HomePage)/sections/LaMarca";
import { ComoComprar } from "@/app/(store)/(HomePage)/sections/ComoComprar";

export default function HomePage() {
  return (
    <main className="w-full">
      <Hero />
      <Destacados />
      <LaMarca />
      <ComoComprar />
    </main>
  );
}

