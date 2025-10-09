import { Link } from "react-router";

import "./Layout.css";

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-content">
        <h1 className="site-title">COmunity Articles</h1>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/articles">Artigos</Link>
          <Link to="/about">Sobre</Link>
          <Link to="/contact">Contato</Link>
        </nav>
      </div>
    </header>
  );
}
