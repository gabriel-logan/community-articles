import ReactMarkdown from "react-markdown";
import { common, createStarryNight } from "@wooorm/starry-night";
import { toHtml } from "hast-util-to-html";
import remarkGfm from "remark-gfm";

interface MarkdownBaseProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  markdownContentRaw: any;
}

const starryNight = await createStarryNight(common);

export default function MarkdownBase({
  markdownContentRaw,
}: MarkdownBaseProps) {
  return (
    <section className="markdown-body min-h-screen">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const code = String(children).replace(/\n$/, "");
            const lang = /language-(\w+)/.exec(className || "")?.[1];

            if (lang) {
              const scope = starryNight.flagToScope(lang);

              if (scope) {
                const tree = starryNight.highlight(code, scope);

                return (
                  <pre className={className}>
                    <code
                      className={className}
                      dangerouslySetInnerHTML={{ __html: toHtml(tree) }}
                    />
                  </pre>
                );
              }
            }

            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {markdownContentRaw}
      </ReactMarkdown>
    </section>
  );
}
