import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import SurahList from "./pages/SurahList";
import SurahDetail from "./pages/SurahDetail";
import Bookmarks from "./pages/Bookmarks";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
      >
        <Route index element={<Home />} />
        <Route path="surahs" element={<SurahList />} />
        <Route path="surah/:number/:edition" element={<SurahDetail />} />
        <Route path="bookmarks" element={<Bookmarks />} />
      </Route>
    </Routes>
  );
}

export default App;
