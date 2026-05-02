import { useEffect, useMemo, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaBookOpen,
  FaSearch,
} from "react-icons/fa";
import { Link } from "react-router";

import { articleFiles } from "../configs/articleFilesRaw";

const articlesPerPage = 8;
const specialArticlePaths = new Set([
  "../../articles/gabriel-logan/example1.md",
  "../../articles/gabriel-logan/example2.md",
]);

declare const __FEATURED_ARTICLE_SEED__: string;

type ArticleCard = {
  path: string;
  username: string;
  fileName: string;
  title: string;
};

function getSeededRank(value: string) {
  let hash = 0;
  const input = `${__FEATURED_ARTICLE_SEED__}:${value}`;

  for (let i = 0; i < input.length; i += 1) {
    hash = Math.imul(31, hash) + input.charCodeAt(i);
  }

  return hash >>> 0;
}

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const articleList = useMemo(() => {
    const list = Object.entries(articleFiles)
      .map(([path]) => {
        const match = path.match(/articles\/([^/]+)\/([^/]+)\.md$/);

        if (!match) {
          return null;
        }

        const [, username, fileName] = match;

        return {
          path,
          username,
          fileName,
          title: fileName.replace(/-/g, " "),
        };
      })
      .filter(Boolean);

    return (list as ArticleCard[]).sort(
      (a, b) => getSeededRank(a.path) - getSeededRank(b.path),
    );
  }, []);

  const specialArticles = useMemo(
    () =>
      articleList.filter((article) => specialArticlePaths.has(article.path)),
    [articleList],
  );

  const regularArticles = useMemo(
    () =>
      articleList.filter((article) => !specialArticlePaths.has(article.path)),
    [articleList],
  );

  const authors = useMemo(
    () =>
      Array.from(new Set(regularArticles.map((article) => article.username))),
    [regularArticles],
  );

  const filteredArticles = useMemo(() => {
    const lowerQuery = query.toLowerCase();

    return regularArticles.filter(
      (a) =>
        (selectedAuthor === "all" || a.username === selectedAuthor) &&
        (a.title.toLowerCase().includes(lowerQuery) ||
          a.username.toLowerCase().includes(lowerQuery)),
    );
  }, [query, selectedAuthor, regularArticles]);

  const featuredArticle = filteredArticles[0] ?? regularArticles[0];
  const pageCount = Math.max(
    1,
    Math.ceil(filteredArticles.length / articlesPerPage),
  );
  const visibleArticles = filteredArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedAuthor]);

  return (
    <main className="min-h-screen bg-[#0d1117] px-4 py-10 text-gray-200 sm:px-6">
      <title>Community Articles</title>
      <meta
        name="description"
        content="A platform for sharing articles from the community. Submit your own articles and read what others have shared."
      />
      <section className="mx-auto max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          <div className="flex min-h-[340px] flex-col justify-between rounded-lg border border-gray-800 bg-[#111820] p-6 shadow-2xl shadow-black/20 sm:p-8">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-md border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
                <FaBookOpen />
                Community Library
              </p>
              <h1 className="max-w-3xl text-4xl font-bold text-gray-100 sm:text-5xl">
                Latest community articles
              </h1>
              <h2 className="mt-4 max-w-2xl text-base leading-7 text-gray-400">
                Explore Markdown articles from the community with search, author
                filters, and a compact reading queue.
              </h2>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-md border border-gray-800 bg-[#0d1117] p-4">
                <p className="text-2xl font-bold text-gray-100">
                  {regularArticles.length}
                </p>
                <p className="mt-1 text-xs text-gray-500 uppercase">articles</p>
              </div>
              <div className="rounded-md border border-gray-800 bg-[#0d1117] p-4">
                <p className="text-2xl font-bold text-gray-100">
                  {authors.length}
                </p>
                <p className="mt-1 text-xs text-gray-500 uppercase">authors</p>
              </div>
              <div className="rounded-md border border-gray-800 bg-[#0d1117] p-4">
                <p className="text-2xl font-bold text-gray-100">
                  {filteredArticles.length}
                </p>
                <p className="mt-1 text-xs text-gray-500 uppercase">matches</p>
              </div>
            </div>
          </div>

          {featuredArticle ? (
            <Link
              to={`/articles/${featuredArticle.username}/${featuredArticle.fileName}`}
              className="group flex min-h-[340px] flex-col justify-between rounded-lg border border-gray-800 bg-[#111820] p-6 transition-all duration-200 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 sm:p-8"
            >
              <div>
                <p className="text-sm font-medium text-blue-400">
                  Start reading
                </p>
                <h3 className="mt-4 text-3xl font-bold text-gray-100 transition-colors group-hover:text-blue-300">
                  {featuredArticle.title}
                </h3>
                <p className="mt-3 text-sm text-gray-500">
                  by {featuredArticle.username}
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-gray-800 pt-5 text-sm text-gray-400">
                <span>Featured from current results</span>
                <FaArrowRight className="transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ) : null}
        </div>

        <div className="mt-8 rounded-lg border border-gray-800 bg-[#111820]">
          <div className="grid gap-4 border-b border-gray-800 p-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="relative">
              <FaSearch className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm text-gray-500" />
              <input
                type="text"
                placeholder="Search by title or author..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-md border border-gray-700 bg-[#0d1117] py-3 pr-4 pl-10 text-sm text-gray-200 placeholder-gray-500 transition-colors outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex max-w-full gap-2 overflow-x-auto pb-1 lg:pb-0">
              <button
                type="button"
                onClick={() => setSelectedAuthor("all")}
                className={`shrink-0 rounded-md border px-4 py-2 text-sm transition-colors ${
                  selectedAuthor === "all"
                    ? "border-blue-500 bg-blue-500/10 text-blue-300"
                    : "border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-200"
                }`}
              >
                All
              </button>

              {authors.map((author) => (
                <button
                  key={author}
                  type="button"
                  onClick={() => setSelectedAuthor(author)}
                  className={`shrink-0 rounded-md border px-4 py-2 text-sm transition-colors ${
                    selectedAuthor === author
                      ? "border-blue-500 bg-blue-500/10 text-blue-300"
                      : "border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-200"
                  }`}
                >
                  {author}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-gray-800">
            {visibleArticles.length > 0 ? (
              visibleArticles.map(({ path, username, fileName, title }) => (
                <Link
                  key={path}
                  to={`/articles/${username}/${fileName}`}
                  className="group grid min-w-0 gap-2 px-4 py-4 transition-colors hover:bg-[#0d1117] sm:grid-cols-[1fr_auto] sm:items-center sm:px-6"
                >
                  <div className="min-w-0">
                    <h3 className="overflow-hidden text-base font-semibold text-ellipsis whitespace-nowrap text-gray-100 group-hover:text-blue-400">
                      {title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">by {username}</p>
                  </div>
                  <span className="text-sm text-gray-500 group-hover:text-blue-400">
                    Read article
                  </span>
                </Link>
              ))
            ) : (
              <p className="px-6 py-12 text-center text-gray-500">
                No articles found.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 border-t border-gray-800 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              Page {currentPage} of {pageCount}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-700 px-4 py-2 text-sm text-gray-300 transition-colors hover:border-gray-600 hover:text-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FaArrowLeft />
                Previous
              </button>
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) => Math.min(pageCount, page + 1))
                }
                disabled={currentPage === pageCount}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-700 px-4 py-2 text-sm text-gray-300 transition-colors hover:border-gray-600 hover:text-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {specialArticles.length > 0 ? (
        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-blue-400">
                Special cards
              </p>
              <h2 className="mt-1 text-2xl font-bold text-gray-100">
                How to submit
              </h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {specialArticles.map(({ path, username, fileName, title }) => (
              <Link
                key={path}
                to={`/articles/${username}/${fileName}`}
                className="group flex min-h-[180px] flex-col justify-between rounded-lg border border-blue-500/30 bg-blue-500/10 p-5 transition-all duration-200 hover:border-blue-400 hover:bg-blue-500/15 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div>
                  <p className="text-sm font-medium text-blue-300">
                    Featured guide
                  </p>
                  <h3 className="mt-3 text-xl font-bold text-gray-100 transition-colors group-hover:text-blue-200">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-400">by {username}</p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-blue-400/20 pt-4 text-sm text-blue-200">
                  <span>Read guide</span>
                  <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
