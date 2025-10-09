import "./Layout.css";

import { Link } from "react-router";

export default function Footer() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
  const currentDay = String(currentDate.getDate()).padStart(2, "0");

  return (
    <footer className="site-footer">
      <p>
        © {currentDay}.{currentMonth}.{currentYear} Community Articles —{" "}
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
