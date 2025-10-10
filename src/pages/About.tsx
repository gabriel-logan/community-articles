export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-6 text-slate-100">
      <h1 className="mb-4 text-5xl font-bold">About This Project</h1>
      <p className="mb-2 max-w-2xl text-center text-lg text-slate-300">
        This project is a community-driven platform for sharing articles written
        in Markdown. It leverages modern web technologies to provide a seamless
        reading experience with syntax highlighting for code snippets.
      </p>
      <p className="mb-2 max-w-2xl text-center text-lg text-slate-300">
        Built with React, React Router, and Tailwind CSS, it showcases the power
        of static site generation and dynamic content loading.
      </p>
      <p className="max-w-2xl text-center text-lg text-slate-300">
        Feel free to explore the articles and contribute your own!
      </p>
    </main>
  );
}
