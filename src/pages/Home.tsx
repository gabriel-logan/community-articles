import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import example2Raw from "../../articles/gabriel-logan/examples/2.md?raw";

export default function HomePage() {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{example2Raw}</ReactMarkdown>
  );
}
