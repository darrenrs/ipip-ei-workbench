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
              <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" />
            </span>
            <strong>IPIP Workbench</strong>
          </NavLink>
          <div>
            <NavLink to="/about">About</NavLink>
            <a href="https://github.com/darrenrs/ipip-workbench">GitHub</a>
          </div>
        </nav>
      </header>

      <main className="container">{children}</main>

      <footer className="container">
        <p>
          <a href="https://darrenskidmore.com">
            &copy; 2026 Darren R. Skidmore.
          </a>{" "}
          &bull;{" "}
          <a href="https://darrenskidmore.com/privacy#ipip-workbench">
            Privacy Policy
          </a>
          <br />
          Built as an open psychometrics and data-science portfolio project. Not
          a clinical or employment-use tool.
        </p>
      </footer>
    </div>
  );
}
