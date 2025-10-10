import { Link } from "react-router";

export default function Footer() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
  const currentDay = String(currentDate.getDate()).padStart(2, "0");

  return (
    <footer className="border-t border-gray-800 bg-[#161b22] py-6 text-center text-sm text-gray-400">
      <p className="mb-1">
        © {currentDay}.{currentMonth}.{currentYear}{" "}
        <span className="text-gray-300">Community Articles</span> —{" "}
        <Link
          to="https://github.com/gabriel-logan/community-articles"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 transition-colors hover:text-blue-300"
        >
          GitHub Repo
        </Link>
      </p>

      <p>
        Built by{" "}
        <Link
          to="https://github.com/gabriel-logan"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 transition-colors hover:text-blue-300"
        >
          Gabriel Logan
        </Link>
      </p>
    </footer>
  );
}
