import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const rowClass =
  "font-mono-tech flex w-full items-center justify-between border-b border-[hsl(var(--border))] py-4 text-xs uppercase tracking-[0.2em] text-[hsl(var(--foreground))]";
const subClass =
  "font-mono-tech py-3 pl-4 text-xs uppercase tracking-[0.2em] text-[hsl(var(--foreground))] opacity-80";

// Small-screen menu: same structure as the header, categories expand in place.
export default function MobileMenu({ links, onClose, isAdmin = false }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="glass-panel max-h-[75vh] overflow-y-auto border-t border-[hsl(var(--border))] px-6 py-2 lg:hidden">
      {links.map((l) =>
        l.children.length > 0 ? (
          <div key={l.title}>
            <button
              type="button"
              onClick={() => setExpanded(expanded === l.title ? null : l.title)}
              aria-expanded={expanded === l.title}
              className={rowClass}
            >
              {l.title}
              <ChevronDown size={16} className={`transition-transform ${expanded === l.title ? "rotate-180" : ""}`} />
            </button>
            {expanded === l.title && (
              <div className="flex flex-col border-b border-[hsl(var(--border))] py-1">
                <Link to={l.route} onClick={onClose} className={`${subClass} text-[hsl(var(--primary))]`}>
                  Shop all {l.title}
                </Link>
                {l.children.map((c) => (
                  <Link key={c.title} to={c.route} onClick={onClose} className={subClass}>
                    {c.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <Link key={l.title} to={l.route} onClick={onClose} className={rowClass}>
            {l.title}
          </Link>
        )
      )}
      {isAdmin && (
        <Link to="/settings" onClick={onClose} className={`${rowClass} border-b-0`}>
          Settings
        </Link>
      )}
    </div>
  );
}