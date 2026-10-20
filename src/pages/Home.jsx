import { useState } from "react";
import Nav from "@/components/mazrood/Nav";
import Hero from "@/components/mazrood/Hero";
import Manifesto from "@/components/mazrood/Manifesto";
import Archive from "@/components/mazrood/Archive";
import RopeLine from "@/components/mazrood/RopeLine";
import EarlyAccess from "@/components/mazrood/EarlyAccess";
import FinalEmittance from "@/components/mazrood/FinalEmittance";
import PullToRefresh from "@/components/mazrood/PullToRefresh";
import BottomTabs from "@/components/mazrood/BottomTabs";

export default function Home() {
  const [refreshTick, setRefreshTick] = useState(0);

  const handleRefresh = async () => {
    setRefreshTick((t) => t + 1);
    // hold the spinner briefly while the live catalog refetches
    await new Promise((r) => setTimeout(r, 700));
  };

  return (
    <div className="relative min-h-screen bg-[hsl(var(--background))]">
      <div className="light-leak" />
      <Nav />
      <PullToRefresh onRefresh={handleRefresh}>
        <main className="relative z-10">
          <Hero />
          <RopeLine refreshKey={refreshTick} />
          <Archive refreshKey={refreshTick} />
          <Manifesto />
          <EarlyAccess />
          <FinalEmittance />
        </main>
      </PullToRefresh>
      {/* clearance for the mobile bottom tab bar */}
      <div className="h-20 md:hidden" />
      <BottomTabs />
    </div>
  );
}