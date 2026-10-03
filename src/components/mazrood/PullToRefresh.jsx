import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";

// Simple touch-based pull-to-refresh for the mobile experience. When the page
// is at the very top and the user pulls down, a spinner grows in; past the
// threshold, releasing runs onRefresh.
export default function PullToRefresh({ onRefresh, children }) {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(null);

  const onTouchStart = (e) => {
    if (refreshing || window.scrollY > 0) {
      startY.current = null;
      return;
    }
    startY.current = e.touches[0].clientY;
  };

  const onTouchMove = (e) => {
    if (startY.current == null) return;
    const delta = e.touches[0].clientY - startY.current;
    if (delta > 0) setPull(Math.min(delta * 0.45, 90));
  };

  const onTouchEnd = async () => {
    if (startY.current == null) return;
    startY.current = null;
    if (pull > 60) {
      setRefreshing(true);
      setPull(34);
      try {
        await onRefresh?.();
      } finally {
        setRefreshing(false);
        setPull(0);
      }
    } else {
      setPull(0);
    }
  };

  return (
    <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      <div
        className="flex items-end justify-center overflow-hidden transition-[height] duration-200"
        style={{ height: pull }}
      >
        <Loader2
          size={18}
          className={`mb-2 text-[hsl(var(--primary))] ${refreshing ? "animate-spin" : ""}`}
        />
      </div>
      {children}
    </div>
  );
}