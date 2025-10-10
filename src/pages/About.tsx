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
