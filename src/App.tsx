import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import "./App.css";

import example2Raw from "../articles/gabriel-logan/examples/2.md?raw";

function App() {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{example2Raw}</ReactMarkdown>
  );
}

export default App;
