import PropTypes from "prop-types";
import { Outlet } from "../lib/router";
import { useTranslation } from "react-i18next";
import Navbar from "./Navbar";

const Layout = ({ darkMode, toggleDarkMode }) => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-emerald-50 via-white to-teal-50 transition-colors duration-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="container mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        <Outlet />
      </main>

      <footer className="mt-auto shrink-0 border-t border-gray-200 bg-white/50 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/50">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} {t("appName")} — {t("footer.madeFor")}
          </p>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {t("footer.data")}: {" "}
            <a
              href="https://alquran.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              AlQuran Cloud API
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

Layout.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
};

export default Layout;
