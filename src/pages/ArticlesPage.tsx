import ReactMarkdown from "react-markdown";
import { useParams } from "react-router";
import remarkGfm from "remark-gfm";

const articleFiles = import.meta.glob("../../articles/*/*.md", {
  as: "raw",
  eager: true,
});

export default function ArticlesPage() {
  const { author, slug } = useParams();

  const path = `../../articles/${author}/${slug}.md`;

  const articleRaw = articleFiles[path];

  if (!articleRaw) {
    return <div>Article not found</div>;
  }

  return (
    <section>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{articleRaw}</ReactMarkdown>
    </section>
  );
}
