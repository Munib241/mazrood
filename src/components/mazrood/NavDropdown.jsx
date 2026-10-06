import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const rowClass =
  "font-mono-tech block whitespace-nowrap rounded-sm px-3 py-2.5 text-xs uppercase tracking-[0.2em] text-[hsl(var(--foreground))] transition hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--primary))]";

// Desktop header item with a hover dropdown of categories.
export default function NavDropdown({ item, tone }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={close}
      onFocus={() => setOpen(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && close()}
    >
      <Link
        to={item.route}
        onClick={close}
        aria-haspopup="true"
        aria-expanded={open}
        className={`font-mono-tech flex items-center gap-1.5 whitespace-nowrap text-[0.8rem] font-medium uppercase tracking-[0.2em] ${tone} transition hover:text-[hsl(var(--primary))]`}
      >
        {item.title}
        <ChevronDown size={14} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </Link>
      {open && (
        <div className="absolute left-0 top-full z-50 pt-4">
          <div className="min-w-[230px] rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-2 shadow-2xl">
            <Link to={item.route} onClick={close} className={`${rowClass} text-[hsl(var(--primary))]`}>
              Shop all {item.title}
            </Link>
            {item.children.map((c) => (
              <Link key={c.title} to={c.route} onClick={close} className={rowClass}>
                {c.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}