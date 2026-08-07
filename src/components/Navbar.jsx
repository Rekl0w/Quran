import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { Bookmark, BookOpen, Home, List, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import LanguageSelect from "./LanguageSelect";

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation();
  const { t } = useTranslation();

  const isActive = (path) => {
    if (path === "/surahs") {
      return (
        location.pathname === "/surahs" ||
        location.pathname.startsWith("/surah/")
      );
    }

    return location.pathname === path;
  };

  const linkClassName = (path) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
      isActive(path)
        ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
        : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
    }`;

  return (
    <motion.nav
      aria-label={t("nav.main")}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 shadow-sm backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/90"
    >
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex min-h-16 flex-wrap items-center justify-between gap-2 py-2">
          <Link
            to="/"
            aria-label={t("nav.homeLabel")}
            className="group flex items-center gap-2"
          >
            <div className="rounded-lg bg-gradient-to-br from-primary-500 to-emerald-600 p-2 shadow-lg transition-all group-hover:shadow-xl">
              <BookOpen aria-hidden="true" className="h-6 w-6 text-white" />
            </div>
            <span className="gradient-text hidden text-xl font-bold lg:inline">
              {t("appName")}
            </span>
          </Link>

          <div className="flex flex-wrap items-center justify-end gap-1 sm:gap-2">
            <Link to="/" aria-label={t("nav.home")} className={linkClassName("/")}>
              <Home aria-hidden="true" className="h-4 w-4" />
              <span className="hidden md:inline">{t("nav.home")}</span>
            </Link>
            <Link
              to="/surahs"
              aria-label={t("nav.surahs")}
              className={linkClassName("/surahs")}
            >
              <List aria-hidden="true" className="h-4 w-4" />
              <span className="hidden md:inline">{t("nav.surahs")}</span>
            </Link>
            <Link
              to="/bookmarks"
              aria-label={t("nav.bookmarks")}
              className={linkClassName("/bookmarks")}
            >
              <Bookmark aria-hidden="true" className="h-4 w-4" />
              <span className="hidden md:inline">{t("nav.bookmarks")}</span>
            </Link>
            <LanguageSelect />
            <button
              type="button"
              onClick={toggleDarkMode}
              className="rounded-lg bg-gray-100 p-2 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
              aria-label={t(darkMode ? "nav.lightMode" : "nav.darkMode")}
              aria-pressed={darkMode}
            >
              {darkMode ? (
                <Sun aria-hidden="true" className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon aria-hidden="true" className="h-5 w-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

Navbar.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
};

export default Navbar;
