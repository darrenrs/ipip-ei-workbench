import { NavLink, Outlet } from "react-router-dom";
import { footerText, siteTitle } from "@/lib/site";

const navItems = [
  { to: "/instruments", label: "Instruments" },
  { to: "/methods", label: "Methods" },
  { to: "/disclaimer", label: "Disclaimer" },
];

export function SiteShell() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <NavLink to="/" className="site-brand">
          <span className="eyebrow">Open Psychometrics</span>
          <span className="site-title">{siteTitle}</span>
        </NavLink>
        <nav className="site-nav" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "nav-link nav-link-active" : "nav-link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="page-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <p>{footerText}</p>
        <div className="footer-links">
          <NavLink to="/disclaimer">Disclaimer</NavLink>
          <NavLink to="/methods">Methods</NavLink>
        </div>
      </footer>
    </div>
  );
}
