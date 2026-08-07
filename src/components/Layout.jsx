import { Suspense } from "react";
import PropTypes from "prop-types";
import { Outlet } from "../lib/router";
import { useTranslation } from "react-i18next";
import { useReaderPreferences } from "../context/ReaderPreferencesContext";
import LoadingSkeleton from "./LoadingSkeleton";
import Navbar from "./Navbar";

const LoadingNavbar = () => (
  <div
    aria-hidden="true"
    className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 shadow-sm backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/90"
  >
    <div className="container mx-auto px-3 sm:px-4">
      <div className="flex min-h-16 items-center justify-between gap-2 py-2">
        <div className="flex items-center gap-2">
          <div className="skeleton h-10 w-10 rounded-lg" />
          <div className="skeleton hidden h-6 w-28 rounded-lg lg:block" />
        </div>
        <div className="flex items-center justify-end gap-1 sm:gap-2">
          <div className="skeleton h-9 w-9 rounded-lg md:w-24" />
          <div className="skeleton h-9 w-9 rounded-lg md:w-24" />
          <div className="skeleton h-9 w-9 rounded-lg md:w-28" />
          <div className="skeleton h-9 w-12 rounded-lg sm:w-36" />
          <div className="skeleton h-9 w-9 rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

const Layout = ({ darkMode, toggleDarkMode }) => {
  const { t } = useTranslation();
  const { languageReady } = useReaderPreferences();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-emerald-50 via-white to-teal-50 transition-colors duration-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {languageReady ? (
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      ) : (
        <LoadingNavbar />
      )}
      <main className="container mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        {languageReady ? (
          <Suspense fallback={<LoadingSkeleton />}>
            <Outlet />
          </Suspense>
        ) : (
          <LoadingSkeleton />
        )}
      </main>

      <footer className="mt-auto shrink-0 border-t border-gray-200 bg-white/50 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/50">
        <div className="container mx-auto px-4 py-6 text-center">
          {languageReady ? (
            <>
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
            </>
          ) : (
            <div aria-hidden="true" className="space-y-2">
              <div className="skeleton mx-auto h-5 w-72 max-w-full rounded-lg" />
              <div className="skeleton mx-auto h-4 w-40 rounded-lg" />
            </div>
          )}
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
