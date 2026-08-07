import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, MapPin, RefreshCw, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getEditions, getSurahs, searchSurahs } from "../lib/api";
import { DEFAULT_EDITION } from "../lib/constants";
import { encodeEditions } from "../lib/utils";
import { useReaderPreferences } from "../context/ReaderPreferencesContext";
import EditionSelect from "../components/EditionSelect";
import LoadingSkeleton from "../components/LoadingSkeleton";

const SurahList = () => {
  const { t } = useTranslation();
  const { editions: selectedEditions, setEditions, uiLanguage } =
    useReaderPreferences();
  const [surahs, setSurahs] = useState([]);
  const [availableEditions, setAvailableEditions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    let active = true;

    const loadPageData = async () => {
      setLoading(true);
      setError(false);

      try {
        const [surahData, editionData] = await Promise.all([
          getSurahs(uiLanguage),
          getEditions(),
        ]);

        if (!active) return;
        setSurahs(surahData);
        setAvailableEditions(editionData);
      } catch (loadError) {
        if (!active) return;
        console.error("Surah list could not be loaded", loadError);
        setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadPageData();
    return () => {
      active = false;
    };
  }, [retryToken, uiLanguage]);

  useEffect(() => {
    if (availableEditions.length === 0) return;

    const availableIds = new Set(
      availableEditions.map((edition) => edition.identifier)
    );
    const validSelections = selectedEditions.filter((edition) =>
      availableIds.has(edition)
    );
    if (validSelections.length === selectedEditions.length) return;

    const fallback = availableIds.has(DEFAULT_EDITION)
      ? DEFAULT_EDITION
      : availableEditions[0].identifier;
    setEditions(validSelections.length > 0 ? validSelections : [fallback]);
  }, [availableEditions, selectedEditions, setEditions]);

  const filteredSurahs = useMemo(
    () => searchSurahs(surahs, searchQuery, uiLanguage),
    [searchQuery, surahs, uiLanguage]
  );

  if (loading) {
    return <LoadingSkeleton variant="surahs" />;
  }

  if (error) {
    return (
      <section className="py-12 text-center" role="alert">
        <p className="text-red-600 dark:text-red-400">{t("surahs.loadError")}</p>
        <button
          type="button"
          onClick={() => setRetryToken((value) => value + 1)}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 font-semibold text-white hover:bg-primary-700"
        >
          <RefreshCw aria-hidden="true" className="h-5 w-5" />
          {t("common.retry")}
        </button>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h1 className="gradient-text text-4xl font-bold md:text-5xl">
          {t("surahs.title")}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t("surahs.intro")}
        </p>
      </motion.header>

      <section
        className="glass space-y-5 rounded-2xl p-6"
        aria-label={t("surahs.filters")}
      >
        <div className="space-y-2">
          <label
            htmlFor="surah-search"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            {t("surahs.searchLabel")}
          </label>
          <div className="relative">
            <Search
              aria-hidden="true"
              className="absolute start-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            />
            <input
              id="surah-search"
              type="search"
              placeholder={t("surahs.searchPlaceholder")}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pe-4 ps-10 text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        <EditionSelect
          id="surah-editions"
          editions={availableEditions}
          value={selectedEditions}
          onChange={setEditions}
        />

        {searchQuery ? (
          <p className="text-sm text-gray-600 dark:text-gray-300" aria-live="polite">
            {t("surahs.found", { count: filteredSurahs.length })}
          </p>
        ) : null}
      </section>

      <section
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        aria-label={t("surahs.list")}
      >
        {filteredSurahs.map((surah) => (
          <Link
            key={surah.number}
            to={`/surah/${surah.number}/${encodeEditions(selectedEditions)}`}
            className="glass group block rounded-xl border border-gray-200 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-emerald-600 font-bold text-white shadow-lg transition-transform group-hover:scale-110">
                  {surah.number}
                </div>
                <h2 className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                  {t("common.surahName", { name: surah.localizedName })}
                </h2>
              </div>
              <div
                lang="ar"
                dir="rtl"
                className="arabic-text shrink-0 text-2xl font-bold text-gray-800 dark:text-white"
              >
                {surah.name}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <MapPin aria-hidden="true" className="h-4 w-4" />
                <span>
                  {t(
                    surah.revelationType === "Meccan"
                      ? "common.meccan"
                      : "common.medinan"
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen aria-hidden="true" className="h-4 w-4" />
                <span>
                  {t("common.ayahCountLabel", {
                    value: surah.numberOfAyahs,
                  })}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {filteredSurahs.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-600 dark:text-gray-300">{t("surahs.noResults")}</p>
        </div>
      ) : null}
    </div>
  );
};

export default SurahList;
