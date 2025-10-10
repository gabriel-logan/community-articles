export default function AboutPage() {
  return (
    <main className="flex min-h-screen justify-center bg-[#0d1117] px-4 py-16">
      <article className="markdown-body w-full max-w-3xl bg-[#0d1117] text-gray-200">
        <h1 className="mb-8 text-center text-4xl font-bold text-gray-100">
          About This Project
        </h1>

        <p className="mb-6 leading-relaxed text-gray-300">
          This project is a community-driven platform for sharing articles
          written in Markdown. It leverages modern web technologies to provide a
          seamless reading experience with syntax highlighting for code
          snippets.
        </p>

        <p className="mb-6 leading-relaxed text-gray-300">
          Community Articles is a platform where anyone can easily publish
          articles using Markdown files on GitHub. The site updates
          automatically, so your content goes live instantly. It's perfect for
          sharing tutorials, guides, and tech insights—whether you're a beginner
          or an expert.
        </p>

        <p className="mb-6 leading-relaxed text-gray-300">
          Articles are stored in a public GitHub repository, making it easy for
          contributors to submit their work via pull requests. Each article is
          rendered with beautiful syntax highlighting.
        </p>

        <p className="mb-6 leading-relaxed text-gray-300">
          Built with <span className="font-medium text-blue-400">React</span>,
          <span className="font-medium text-blue-400"> React Router</span>, and
          <span className="font-medium text-blue-400"> Tailwind CSS</span>, it
          showcases the power of static site generation and dynamic content
          loading.
        </p>

        <p className="leading-relaxed text-gray-300">
          Feel free to explore the articles and contribute your own!
        </p>
      </article>
    </main>
  );
}
