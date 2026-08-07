import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bookmark, BookOpen, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { getSurahs } from "../lib/api";
import { encodeEditions, getBookmarks, removeBookmark } from "../lib/utils";
import { useReaderPreferences } from "../context/ReaderPreferencesContext";

const Bookmarks = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { editions: preferredEditions, uiLanguage } = useReaderPreferences();
  const [bookmarks, setBookmarks] = useState(() =>
    getBookmarks(preferredEditions)
  );
  const [surahNames, setSurahNames] = useState(new Map());

  useEffect(() => {
    let active = true;
    getSurahs(uiLanguage)
      .then((surahs) => {
        if (active) {
          setSurahNames(
            new Map(surahs.map((surah) => [surah.number, surah.localizedName]))
          );
        }
      })
      .catch((error) => {
        console.warn("Bookmark surah names could not be localized", error);
      });

    return () => {
      active = false;
    };
  }, [uiLanguage]);

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(uiLanguage, {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    [uiLanguage]
  );

  const formatDate = (dateString) => {
    if (!dateString) return t("bookmarks.noDate");
    const date = new Date(dateString);
    return Number.isNaN(date.getTime())
      ? t("bookmarks.noDate")
      : dateFormatter.format(date);
  };

  const handleRemoveBookmark = (bookmark) => {
    const result = removeBookmark(bookmark.id, preferredEditions);
    if (!result.saved) {
      toast.error(t("bookmarks.removeFailed"));
      return;
    }

    setBookmarks(result.bookmarks);
    toast.success(t("bookmarks.removed"));
  };

  const handleGoToAyah = (bookmark) => {
    navigate(
      `/surah/${bookmark.surahNumber}/${encodeEditions(bookmark.editions)}#ayah-${bookmark.ayahNumber}`
    );
  };

  return (
    <div className="space-y-8">
      <header>
        <div className="flex items-start gap-4">
          <div className="mt-1 flex h-12 w-12 shrink-0 items-start justify-center">
            <Bookmark
              aria-hidden="true"
              className="h-10 w-10 text-primary-600 dark:text-primary-400"
            />
          </div>
          <div className="min-w-0 space-y-2">
            <h1 className="gradient-text text-4xl font-bold leading-tight md:text-5xl">
              {t("bookmarks.title")}
            </h1>
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
              {t("bookmarks.intro")}
            </p>
          </div>
        </div>
      </header>

      {bookmarks.length === 0 ? (
        <section className="glass rounded-2xl border border-gray-200 p-12 text-center dark:border-gray-700">
          <Bookmark
            aria-hidden="true"
            className="mx-auto mb-4 h-16 w-16 text-gray-400 dark:text-gray-600"
          />
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            {t("bookmarks.emptyTitle")}
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            {t("bookmarks.emptyDescription")}
          </p>
          <Link
            to="/surahs"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-emerald-600 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg"
          >
            <BookOpen aria-hidden="true" className="h-5 w-5" />
            <span>{t("bookmarks.goToSurahs")}</span>
          </Link>
        </section>
      ) : (
        <section className="space-y-4" aria-label={t("bookmarks.saved")}>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t("bookmarks.total", { count: bookmarks.length })}
          </p>

          {bookmarks.map((bookmark, index) => {
            const displayedName =
              surahNames.get(bookmark.surahNumber) ?? bookmark.surahName;

            return (
              <motion.article
                key={bookmark.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="glass rounded-xl border border-gray-200 p-5 transition-all hover:shadow-lg dark:border-gray-700 md:p-6"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-emerald-600 font-bold text-white shadow-lg">
                        {bookmark.surahNumber}
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {t("common.surahName", { name: displayedName })}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {t("common.ayah")} {bookmark.ayahNumber} · {bookmark.editions.join(", ")}
                        </p>
                      </div>
                    </div>

                    {bookmark.excerpt ? (
                      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-700 dark:text-gray-200">
                        {bookmark.excerpt}
                      </p>
                    ) : null}
                    <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(bookmark.timestamp)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleGoToAyah(bookmark)}
                      className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                    >
                      {t("bookmarks.goToAyah")}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveBookmark(bookmark)}
                      className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                      aria-label={t("bookmarks.removeLabel", {
                        name: displayedName,
                        number: bookmark.ayahNumber,
                      })}
                    >
                      <Trash2 aria-hidden="true" className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </section>
      )}
    </div>
  );
};

export default Bookmarks;
