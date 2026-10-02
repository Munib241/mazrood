import Nav from "@/components/mazrood/Nav";
import PrecisionRules from "@/components/mazrood/PrecisionRules";
import Hero from "@/components/mazrood/Hero";
import NewArrivals from "@/components/mazrood/NewArrivals";
import TheLook from "@/components/mazrood/TheLook";
import Sale from "@/components/mazrood/Sale";
import FinalEmittance from "@/components/mazrood/FinalEmittance";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[hsl(var(--background))]">
      <div className="light-leak" />
      <PrecisionRules />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <NewArrivals />
        <TheLook />
        <Sale />
        <FinalEmittance />
      </main>
    </div>
  );
}