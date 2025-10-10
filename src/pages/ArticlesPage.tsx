import { useParams } from "react-router";

import MarkdownBase from "../components/MarkdownBase";

const articleFiles = import.meta.glob<string>("../../articles/*/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

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

  return <MarkdownBase markdownContentRaw={articleRaw} />;
}
