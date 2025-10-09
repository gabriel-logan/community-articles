import { BrowserRouter, Route, Routes } from "react-router";

import HomePage from "./pages/Home";
import NotFoundPage from "./pages/NotFound";
import ArticlesPage from "./pages/ArticlesPage";
import Header from "./components/Header";
import Footer from "./components/Footer";

import "./App.css";

function App() {
  return (
    <BrowserRouter basename="/community-articles/">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/articles/:author/:slug" element={<ArticlesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
