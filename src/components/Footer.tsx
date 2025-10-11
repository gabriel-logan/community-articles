import { FaGithub, FaReact, FaRegCopyright } from "react-icons/fa";
import { Link } from "react-router";

export default function Footer() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
  const currentDay = String(currentDate.getDate()).padStart(2, "0");

  return (
    <footer className="border-t border-gray-800 bg-[#161b22] py-6 text-sm text-gray-400">
      <div className="container mx-auto flex flex-col items-center gap-3">
        <p className="flex items-center gap-2">
          <span>
            {currentDay}.{currentMonth}.{currentYear}
          </span>
          <span className="text-gray-300">• Community Articles</span>
          <Link
            to="https://github.com/gabriel-logan/community-articles"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-400 transition-colors hover:text-blue-300"
          >
            <FaGithub className="inline text-lg" />
            GitHub Repo
          </Link>
        </p>

        <p className="flex items-center gap-2">
          Built with <FaReact className="animate-spin-slow text-blue-400" /> by{" "}
          <Link
            to="https://github.com/gabriel-logan"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 transition-colors hover:text-blue-300"
          >
            Gabriel Logan
          </Link>
        </p>

        <div className="mt-2 flex items-center gap-1 rounded-md border border-gray-700 px-3 py-1 text-xs text-gray-500 select-none">
          <FaRegCopyright className="text-[12px]" />
          <span>{currentYear} Community Articles</span>
        </div>
      </div>
    </footer>
  );
}
