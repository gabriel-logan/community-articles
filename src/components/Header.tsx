import { Link } from "react-router";

export default function Header() {
  return (
    <header className="border-b border-gray-800 bg-[#161b22] text-gray-200">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <h1 className="text-xl font-semibold tracking-tight">
          <Link
            to="/"
            className="transition-colors duration-200 hover:text-blue-400"
          >
            Community Articles
          </Link>
        </h1>

        <nav className="flex gap-6">
          <Link
            to="/"
            className="transition-colors duration-200 hover:text-blue-400"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="transition-colors duration-200 hover:text-blue-400"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
