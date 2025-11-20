import { useParams } from "react-router";

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

  return (
    <>
      <title>{dinamicTitle}</title>

      <MarkdownBase markdownContentRaw={articleRaw} author={author} />
    </>
  );
}
