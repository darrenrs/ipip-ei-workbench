import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

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
            <strong>IPIP Workbench</strong>
          </NavLink>
          <div>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/privacy">Privacy</NavLink>
          </div>
        </nav>
      </header>

      <main className="container">{children}</main>

      <footer className="container">
        <p>
          &copy; 2026 Darren R. Skidmore.
          <br />
          Built as an open psychometrics and data-science portfolio project. Not
          a clinical or employment-use tool.
        </p>
      </footer>
    </div>
  );
}
