import example2Raw from "../../articles/gabriel-logan/example2.md?raw";
import MarkdownBase from "../components/MarkdownBase";

export default function HomePage() {
  return <MarkdownBase markdownContentRaw={example2Raw} />;
}
