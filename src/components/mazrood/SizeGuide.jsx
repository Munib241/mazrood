import { Ruler } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Garment measurements, taken flat, in cm.
const ROWS = [
  ["S", "50", "68", "21"],
  ["M", "54", "70", "22"],
  ["L", "58", "72", "23"],
  ["XL", "62", "74", "24"],
];

// "Size guide" trigger + pop-up table for quick measurement checks.
export default function SizeGuide() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="font-mono-tech ml-3 inline-flex items-center gap-1.5 align-baseline text-[0.65rem] uppercase tracking-[0.2em] text-[hsl(var(--primary))] underline underline-offset-4 transition hover:opacity-70"
        >
          <Ruler size={12} strokeWidth={1.5} />
          Size guide
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm rounded-sm bg-[hsl(var(--card))] p-6">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl font-light uppercase tracking-[0.05em] text-[hsl(var(--foreground))]">
            Size guide
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-mono-tech text-sm">
            <thead>
              <tr className="border-b border-[hsl(var(--border))]">
                {["Size", "Chest", "Length", "Sleeve"].map((h) => (
                  <th
                    key={h}
                    className="px-2 py-2.5 text-left text-[0.6rem] font-medium uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row[0]} className="border-b border-[hsl(var(--border))] last:border-0">
                  {row.map((cell, i) => (
                    <td
                      key={i}
                      className={`px-2 py-2.5 ${i === 0 ? "font-medium text-[hsl(var(--foreground))]" : "text-[hsl(var(--muted-foreground))]"}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
          Garment measurements in cm, taken flat. Pieces are cut oversized —
          size down for a closer fit.
        </p>
      </DialogContent>
    </Dialog>
  );
}