import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import example2Raw from "../../articles/gabriel-logan/example2.md?raw";

export default function HomePage() {
  return (
    <section className="markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{example2Raw}</ReactMarkdown>
    </section>
  );
}
