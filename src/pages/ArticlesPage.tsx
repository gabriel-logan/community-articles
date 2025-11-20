import { Link, useParams } from "react-router";

import MarkdownBase from "../components/MarkdownBase";
import { articleFiles } from "../configs/articleFilesRaw";

export default function ArticlesPage() {
  const { author, slug } = useParams();

  const path = `../../articles/${author}/${slug}.md`;

  const articleRaw = articleFiles[path];

  if (!articleRaw) {
    return (
      <div className="flex min-h-screen items-center justify-center text-2xl font-bold">
        Article not found
      </div>
    );
  }

  const dinamicTitle = `${author} - ${slug}`;

  const githubUrl = `https://github.com/${author}`;

  return (
    <>
      <title>{dinamicTitle}</title>

      <div className="relative">
        <div className="absolute top-4 right-8 rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur transition hover:bg-black/70">
          <Link to={githubUrl} target="_blank" rel="noopener noreferrer">
            Author: {author}
          </Link>
        </div>

        <MarkdownBase markdownContentRaw={articleRaw} />
      </div>
    </>
  );
}
