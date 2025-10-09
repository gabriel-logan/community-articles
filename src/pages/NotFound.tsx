import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-6 text-slate-100">
      <h1 className="mb-4 text-5xl font-bold">404</h1>
      <p className="mb-8 text-xl text-slate-400">Not Found</p>
      <Link
        to="/"
        className="rounded-md bg-sky-500 px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-sky-400"
      >
        Back to Home
      </Link>
    </main>
  );
}
