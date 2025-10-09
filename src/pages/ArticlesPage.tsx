import { useParams } from "react-router";

const articleFiles = import.meta.glob("../articles/*/*.md", {
  as: "raw",
  eager: true,
});

export default function ArticlesPage() {
  const { author, slug } = useParams();

  const path = `../articles/${author}/${slug}.md`;

  const articleRaw = articleFiles[path];

  if (!articleRaw) {
    return <div>Article not found</div>;
  }

  return <div>{articleRaw}</div>;
}
