import { Link } from "react-router";

export default function Header() {
  return (
    <header className="sticky top-0 z-[100] bg-slate-900 px-8 py-4 text-slate-100 shadow-md">
      <div className="flex items-center justify-between">
        <h1 className="text-[1.6rem] font-bold tracking-[-0.5px]">
          <Link to="/">Community Articles</Link>
        </h1>

        <nav className="flex gap-6">
          <Link
            to="/"
            className="font-medium text-slate-200 no-underline transition-colors duration-200 hover:text-sky-400"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="font-medium text-slate-200 no-underline transition-colors duration-200 hover:text-sky-400"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
