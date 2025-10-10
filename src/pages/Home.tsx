import { useMemo, useState } from "react";
import { Link } from "react-router";

import { articleFiles } from "../configs/articleFilesRaw";

export default function HomePage() {
  const [query, setQuery] = useState("");

  const articleList = useMemo(() => {
    const list = Object.entries(articleFiles)
      .map(([path]) => {
        const match = path.match(/articles\/([^/]+)\/([^/]+)\.md$/);

        if (!match) {
          return null;
        }

        const [, username, fileName] = match;

        return { path, username, fileName };
      })
      .filter(Boolean);

    return list as { path: string; username: string; fileName: string }[];
  }, []);

  const filteredArticles = useMemo(() => {
    const lowerQuery = query.toLowerCase();

    return articleList.filter(
      (a) =>
        a.fileName.toLowerCase().includes(lowerQuery) ||
        a.username.toLowerCase().includes(lowerQuery),
    );
  }, [query, articleList]);

  return (
    <main className="min-h-screen bg-[#0d1117] px-4 py-12 text-gray-200">
      <section className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-100">
          Latest Articles
        </h1>

        <h2 className="mb-8 text-center text-sm text-gray-400">
          Discover and share articles written in Markdown by the community.
        </h2>

        <div className="mb-10 flex justify-center">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full max-w-md rounded-lg border border-gray-700 bg-[#111820] px-4 py-2 text-sm text-gray-200 placeholder-gray-500 transition-colors outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.length > 0 ? (
            filteredArticles.map(({ path, username, fileName }) => (
              <Link
                key={path}
                to={`/articles/${username}/${fileName}`}
                className="group block rounded-xl border border-gray-800 bg-[#111820] p-6 transition-all duration-200 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <h3 className="truncate text-xl font-semibold text-gray-100 group-hover:text-blue-400">
                  {fileName.replace(/-/g, " ")}
                </h3>
                <p className="mt-2 text-sm text-gray-500">by {username}</p>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No articles found.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
