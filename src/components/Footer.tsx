import "./Layout.css";

import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="site-footer">
      <p>
        © {new Date().getFullYear()} Community Articles —{" "}
        <Link
          to="https://github.com/gabriel-logan/community-articles"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub Repo
        </Link>
      </p>
    </footer>
  );
}
