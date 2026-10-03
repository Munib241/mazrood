import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home as HomeIcon, Sparkles, Tag, User } from "lucide-react";

// Scrolls to a home-page section, navigating home first when we are on
// another route (e.g. Settings).
const scrollToSection = (navigate, id) => {
  if (window.location.pathname !== "/") {
    navigate("/");
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  } else {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }
};

export default function BottomTabs() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const goHome = () => {
    if (window.location.pathname !== "/") {
      navigate("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const tabClass = (active) =>
    `flex min-h-[56px] min-w-[44px] flex-1 flex-col items-center justify-center gap-1 ${
      active ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--foreground))] opacity-70"
    }`;

  return (
    <nav
      aria-label="Primary mobile navigation"
      className="glass-panel safe-area-bottom fixed inset-x-0 bottom-0 z-50 border-t border-[hsl(var(--border))] md:hidden"
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2 py-1">
        <button type="button" onClick={goHome} aria-label="Home" className={tabClass(pathname === "/")}>
          <HomeIcon size={20} />
          <span className="font-mono-tech text-[0.55rem] uppercase tracking-[0.2em]">Home</span>
        </button>
        <button
          type="button"
          onClick={() => scrollToSection(navigate, "new")}
          aria-label="New arrivals"
          className={tabClass(false)}
        >
          <Sparkles size={20} />
          <span className="font-mono-tech text-[0.55rem] uppercase tracking-[0.2em]">New</span>
        </button>
        <button
          type="button"
          onClick={() => scrollToSection(navigate, "sale")}
          aria-label="Sale"
          className={tabClass(false)}
        >
          <Tag size={20} />
          <span className="font-mono-tech text-[0.55rem] uppercase tracking-[0.2em]">Sale</span>
        </button>
        <Link to="/settings" aria-label="Settings" className={tabClass(pathname === "/settings")}>
          <User size={20} />
          <span className="font-mono-tech text-[0.55rem] uppercase tracking-[0.2em]">Settings</span>
        </Link>
      </div>
    </nav>
  );
}