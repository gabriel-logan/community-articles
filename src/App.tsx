import { BrowserRouter, Route, Routes } from "react-router";

import HomePage from "./pages/Home";
import NotFoundPage from "./pages/NotFound";
import ArticlesPage from "./pages/ArticlesPage";

import "./App.css";

function App() {
  return (
    <BrowserRouter basename="/community-articles/">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/articles/:author/:slug" element={<ArticlesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
