import { type JSX, useEffect, useState } from "react";
import { FiArrowUp, FiCheck, FiCopy, FiLink } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import { useLocation, useNavigate } from "react-router";
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
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [showToTop, setShowToTop] = useState<boolean>(false);

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const hash = location.hash.startsWith("#")
        ? location.hash.slice(1)
        : location.hash;

      const safeSelector = `#${CSS.escape(hash)}`;
      const el = document.querySelector(safeSelector);

      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location.hash]);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop || 0;
      const total = Math.max(doc.scrollHeight - window.innerHeight, 0);
      const pct = total > 0 ? Math.min(100, Math.max(0, (scrollTop / total) * 100)) : 0;
      setProgress(pct);
      setShowToTop(scrollTop > 400);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="markdown-body min-h-screen">
      {/* Reading progress bar */}
      <div className="fixed left-0 top-0 z-50 h-1 w-full bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-[width] duration-150"
          style={{ width: `${progress}%` }}
          aria-hidden
        />
      </div>

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <Heading level={1}>{children}</Heading>,
          h2: ({ children }) => <Heading level={2}>{children}</Heading>,

          code({ className, children, ...props }) {
            const code = String(children).replace(/\n$/, "");
            const lang = /language-(\w+)/.exec(className || "")?.[1];

            if (lang) {
              const scope = starryNight.flagToScope(lang);

              if (scope) {
                const tree = starryNight.highlight(code, scope);
                const html = toHtml(tree);

                return (
                  <div className="group relative">
                    <pre className={className}>
                      <code
                        className={className}
                        dangerouslySetInnerHTML={{ __html: html }}
                      />
                    </pre>

                    <button
                      onClick={async () => {
                        await navigator.clipboard.writeText(code);
                        setCopiedCode(code);
                        setTimeout(() => setCopiedCode(null), 2000);
                      }}
                      className="absolute top-2 right-2 flex cursor-pointer items-center gap-1 rounded bg-gray-700 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-800"
                    >
                      {copiedCode === code ? (
                        <>
                          <FiCheck size={14} /> Copied
                        </>
                      ) : (
                        <>
                          <FiCopy size={14} /> Copy
                        </>
                      )}
                    </button>
                  </div>
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

      {/* Back to top button */}
      {showToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/70"
          aria-label="Back to top"
          title="Back to top"
        >
          <FiArrowUp size={18} />
        </button>
      )}
    </section>
  );
}

function Heading({
  level,
  children,
}: {
  level: number;
  children: React.ReactNode;
}) {
  const navigate = useNavigate();

  const text = String(children)
    .replace(/<\/?[^>]+(>|$)/g, "")
    .trim();
  const id = text.toLowerCase().replace(/[^\w]+/g, "-");

  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`#${id}`, { replace: true });
    navigator.clipboard.writeText(
      `${window.location.origin}${window.location.pathname}#${id}`,
    );
  };

  return (
    <Tag id={id} className="group flex scroll-mt-24 items-center gap-2">
      {children}
      <button
        onClick={handleClick}
        className="cursor-pointer text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-blue-500"
        aria-label="Copy link to clipboard"
      >
        <FiLink size={16} />
      </button>
    </Tag>
  );
}
