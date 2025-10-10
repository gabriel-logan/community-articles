import { useState } from "react";
import { Link } from "react-router";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-[#161b22] text-gray-200">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
          <Link to="/" className="transition-colors hover:text-blue-400">
            Community Articles
          </Link>
        </h1>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center text-gray-300 hover:text-blue-400 focus:outline-none sm:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        <nav className="hidden gap-6 sm:flex">
          <Link to="/" className="transition-colors hover:text-blue-400">
            Home
          </Link>
          <Link
            to="https://github.com/gabriel-logan/community-articles/blob/main/README.md"
            className="transition-colors hover:text-blue-400"
            target="_blank"
          >
            How to Submit
          </Link>
          <Link to="/about" className="transition-colors hover:text-blue-400">
            About
          </Link>
        </nav>
      </div>

      {isOpen && (
        <nav className="flex flex-col space-y-2 border-t border-gray-800 bg-[#161b22] px-6 py-3 sm:hidden">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="transition-colors hover:text-blue-400"
          >
            Home
          </Link>
          <Link
            to="https://github.com/gabriel-logan/community-articles/blob/main/README.md"
            onClick={() => setIsOpen(false)}
            className="transition-colors hover:text-blue-400"
            target="_blank"
          >
            How to Submit
          </Link>
          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className="transition-colors hover:text-blue-400"
          >
            About
          </Link>
        </nav>
      )}
    </header>
  );
}
