import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { footerText, navItems, siteTitle } from "@/lib/site";

type PageLayoutProps = {
  children: ReactNode;
};

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="page-shell">
      <header>
        <nav className="container">
          <NavLink to="/" className="brand" aria-label="Go to home page">
            <span className="logo-mark" aria-hidden="true">
              <img src="/favicon.svg" alt="" />
            </span>
            <strong>{siteTitle}</strong>
          </NavLink>
          <div>
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to}>
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      <main className="container">{children}</main>

      <footer className="container">
        <p>{footerText}</p>
      </footer>
    </div>
  );
}
