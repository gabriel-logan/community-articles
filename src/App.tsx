import { BrowserRouter, Route, Routes } from "react-router";

import Footer from "./components/Footer";
import Header from "./components/Header";
import AboutPage from "./pages/About";
import ArticlesPage from "./pages/ArticlesPage";
import HomePage from "./pages/Home";
import NotFoundPage from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter basename="/community-articles/">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/articles/:author/:slug" element={<ArticlesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
