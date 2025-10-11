import { useState } from "react";
import { FaBars, FaTimes, FaUsers } from "react-icons/fa";
import { Link } from "react-router";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-[#161b22]/95 text-gray-200 shadow-lg backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:py-6">
        <div className="flex items-center gap-2">
          <FaUsers className="text-[clamp(1.3rem,2vw,1.8rem)] text-gray-300" />
          <h1 className="text-[clamp(1.1rem,2.5vw,1.7rem)] font-semibold tracking-tight">
            <Link
              to="/"
              className="bg-gradient-to-r from-gray-100 via-gray-300 to-gray-100 bg-clip-text text-transparent transition-all hover:from-gray-200 hover:via-gray-100 hover:to-gray-300"
            >
              Community Articles
            </Link>
          </h1>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center text-gray-300 hover:text-gray-100 focus:outline-none sm:hidden"
        >
          {isOpen ? (
            <FaTimes className="text-[clamp(1.5rem,3vw,2rem)]" />
          ) : (
            <FaBars className="text-[clamp(1.5rem,3vw,2rem)]" />
          )}
        </button>

        <nav className="hidden gap-8 text-[clamp(0.9rem,1.2vw,1rem)] font-medium sm:flex">
          <Link to="/" className="transition-colors hover:text-gray-100">
            Home
          </Link>
          <Link
            to="/articles/gabriel-logan/example1"
            className="transition-colors hover:text-gray-100"
          >
            How to Submit
          </Link>
          <Link to="/about" className="transition-colors hover:text-gray-100">
            About
          </Link>
        </nav>
      </div>

      <div
        className={`overflow-hidden border-t border-gray-800 bg-[#161b22] transition-all duration-300 ease-in-out sm:hidden ${
          isOpen ? "max-h-48 py-3 opacity-100" : "max-h-0 py-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col space-y-3 px-6 text-[clamp(0.95rem,2vw,1.1rem)]">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="transition-colors hover:text-gray-100"
          >
            Home
          </Link>
          <Link
            to="/articles/gabriel-logan/example1"
            onClick={() => setIsOpen(false)}
            className="transition-colors hover:text-gray-100"
          >
            How to Submit
          </Link>
          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className="transition-colors hover:text-gray-100"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
