import { BrowserRouter, Route, Routes } from "react-router";

import HomePage from "./pages/Home";
import NotFoundPage from "./pages/NotFound";

import "./App.css";

function App() {
  return (
    <BrowserRouter basename="/community-articles/">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
