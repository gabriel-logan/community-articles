import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0d1117] px-6 text-center text-gray-200">
      <title>404 - Page Not Found</title>
      <meta
        name="description"
        content="The page you are looking for does not exist."
      />
      <h1 className="mb-4 text-7xl font-extrabold text-gray-100">404</h1>
      <p className="mb-8 text-xl text-gray-400">Page Not Found</p>
      <Link
        to="/"
        className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition-colors duration-200 hover:bg-blue-500"
      >
        Back to Home
      </Link>
    </main>
  );
}
