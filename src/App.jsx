import { lazy, useEffect, useState } from "react";
import { Route, Routes } from "./lib/router";
import { MotionConfig } from "framer-motion";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";
import { ReaderPreferencesProvider } from "./context/ReaderPreferencesContext";
import {
  getDarkModePreference,
  saveDarkModePreference,
} from "./lib/utils";

const Home = lazy(() => import("./pages/Home"));
const SurahList = lazy(() => import("./pages/SurahList"));
const SurahDetail = lazy(() => import("./pages/SurahDetail"));
const Bookmarks = lazy(() => import("./pages/Bookmarks"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  const [darkMode, setDarkMode] = useState(getDarkModePreference);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    document.documentElement.style.colorScheme = darkMode ? "dark" : "light";
    saveDarkModePreference(darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((currentMode) => !currentMode);
  };

  return (
    <MotionConfig reducedMotion="user">
      <ReaderPreferencesProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route
            element={
              <Layout
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />
            }
          >
            <Route index element={<Home />} />
            <Route path="surahs" element={<SurahList />} />
            <Route path="surah/:number/:editions" element={<SurahDetail />} />
            <Route path="bookmarks" element={<Bookmarks />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ReaderPreferencesProvider>
    </MotionConfig>
  );
}

export default App;
