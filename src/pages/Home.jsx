import { useEffect, useState } from "react";
import { Link } from "../lib/router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Heart,
  History,
  Search,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { getSurahs } from "../lib/api";
import { encodeEditions, getLastRead } from "../lib/utils";
import { useReaderPreferences } from "../context/ReaderPreferencesContext";

const FEATURES = [
  { icon: BookOpen, title: "home.feature1Title", description: "home.feature1Description" },
  { icon: Search, title: "home.feature2Title", description: "home.feature2Description" },
  { icon: Heart, title: "home.feature3Title", description: "home.feature3Description" },
  { icon: Sparkles, title: "home.feature4Title", description: "home.feature4Description" },
];

const Home = () => {
  const { t } = useTranslation();
  const { uiLanguage } = useReaderPreferences();
  const [lastRead] = useState(getLastRead);
  const [lastReadName, setLastReadName] = useState(lastRead?.surahName ?? "");

  useEffect(() => {
    if (!lastRead) return undefined;
    let active = true;

    getSurahs(uiLanguage)
      .then((surahs) => {
        if (active) {
          setLastReadName(
            surahs.find((surah) => surah.number === lastRead.surahNumber)
              ?.localizedName ?? lastRead.surahName
          );
        }
      })
      .catch((error) => {
        console.warn("Last read surah name could not be localized", error);
      });

    return () => {
      active = false;
    };
  }, [lastRead, uiLanguage]);

  return (
    <div className="space-y-16 md:space-y-20">
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-8 py-8 text-center md:py-12"
      >
        <div className="relative inline-block">
          <motion.div
            aria-hidden="true"
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-r from-primary-400 to-emerald-400 opacity-30 blur-3xl"
          />
          <h1 className="relative mb-6 text-5xl font-bold md:text-7xl">
            <span className="gradient-text">{t("appName")}</span>
          </h1>
        </div>

        <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300 md:text-2xl">
          {t("home.subtitle")}
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/surahs"
            className="group relative flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-emerald-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <span>{t("home.start")}</span>
            <ArrowRight
              aria-hidden="true"
              className="h-5 w-5 transition-transform group-hover:translate-x-1 rtl:rotate-180"
            />
          </Link>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t("home.summary")}
          </div>
        </div>
      </motion.section>

      {lastRead ? (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl border border-primary-200 p-6 dark:border-primary-900/60 md:p-8"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-primary-100 p-3 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                <History aria-hidden="true" className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-primary-700 dark:text-primary-300">
                  {t("home.continueTitle")}
                </p>
                <h2 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                  {t("common.surahName", { name: lastReadName })}
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  {t("common.ayah")} {lastRead.ayahNumber} · {lastRead.editions.join(", ")}
                </p>
              </div>
            </div>
            <Link
              to={`/surah/${lastRead.surahNumber}/${encodeEditions(lastRead.editions)}#ayah-${lastRead.ayahNumber}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3 font-semibold text-white hover:bg-primary-700"
            >
              {t("home.continue")}
              <ArrowRight aria-hidden="true" className="h-5 w-5 rtl:rotate-180" />
            </Link>
          </div>
        </motion.section>
      ) : null}

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="glass group rounded-2xl border border-gray-200 p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-gray-700"
            >
              <Icon
                aria-hidden="true"
                className="mb-4 h-8 w-8 text-primary-600 transition-transform group-hover:scale-110 dark:text-primary-400"
              />
              <h2 className="mb-2 text-lg font-semibold dark:text-white">
                {t(feature.title)}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t(feature.description)}
              </p>
            </motion.article>
          );
        })}
      </section>

      <section className="glass rounded-3xl p-8 md:p-12">
        <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
          <div>
            <div className="gradient-text mb-2 text-4xl font-bold md:text-5xl">114</div>
            <div className="text-gray-600 dark:text-gray-400">{t("home.surahs")}</div>
          </div>
          <div>
            <div className="gradient-text mb-2 text-4xl font-bold md:text-5xl">6,236</div>
            <div className="text-gray-600 dark:text-gray-400">{t("home.ayahs")}</div>
          </div>
          <div>
            <div className="gradient-text mb-2 text-4xl font-bold md:text-5xl">100+</div>
            <div className="text-gray-600 dark:text-gray-400">{t("home.translations")}</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
