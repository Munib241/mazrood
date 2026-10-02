import Nav from "@/components/mazrood/Nav";
import PrecisionRules from "@/components/mazrood/PrecisionRules";
import Hero from "@/components/mazrood/Hero";
import LumenGallery from "@/components/mazrood/LumenGallery";
import TechnicalBlueprint from "@/components/mazrood/TechnicalBlueprint";
import FinalEmittance from "@/components/mazrood/FinalEmittance";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[hsl(var(--background))]">
      <div className="light-leak" />
      <PrecisionRules />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <LumenGallery />
        <TechnicalBlueprint />
        <FinalEmittance />
      </main>
    </div>
  );
}