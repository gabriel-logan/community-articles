import { Link } from "react-router";

export default function Footer() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
  const currentDay = String(currentDate.getDate()).padStart(2, "0");

  return (
    <footer className="bg-slate-900 py-6 text-center text-slate-400 shadow-[0_-2px_6px_rgba(0,0,0,0.2)]">
      <p>
        © {currentDay}.{currentMonth}.{currentYear} Community Articles —{" "}
        <Link
          to="https://github.com/gabriel-logan/community-articles"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-400 no-underline hover:underline"
        >
          GitHub Repo
        </Link>
      </p>
    </footer>
  );
}
