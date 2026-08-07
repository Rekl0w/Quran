import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronsUpDown,
  CircleHelp,
  Columns3,
  MousePointerClick,
  Search,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { getLanguageName } from "../lib/api";
import { MAX_COMPARE_EDITIONS } from "../lib/constants";
import {
  getTranslationGuideSeen,
  saveTranslationGuideSeen,
} from "../lib/utils";
import { useReaderPreferences } from "../context/ReaderPreferencesContext";

const EditionSelect = ({
  editions,
  value,
  onChange,
  id = "editions",
  disabled = false,
}) => {
  const { t } = useTranslation();
  const { uiLanguage } = useReaderPreferences();
  const [query, setQuery] = useState("");
  const [limitMessage, setLimitMessage] = useState("");
  const [guideOpen, setGuideOpen] = useState(
    () => !getTranslationGuideSeen()
  );
  const guideCloseRef = useRef(null);
  const pickerRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      const picker = pickerRef.current;
      if (picker?.open && !picker.contains(event.target)) {
        picker.open = false;
        setQuery("");
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && pickerRef.current?.open) {
        pickerRef.current.open = false;
        setQuery("");
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!guideOpen) return undefined;

    const previouslyFocused = document.activeElement;
    const focusTimer = window.setTimeout(
      () => guideCloseRef.current?.focus(),
      0
    );
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        saveTranslationGuideSeen();
        setGuideOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [guideOpen]);

  const editionMap = useMemo(
    () => new Map(editions.map((edition) => [edition.identifier, edition])),
    [editions]
  );

  const visibleEditions = useMemo(() => {
    const normalizedQuery = query.toLocaleLowerCase(uiLanguage).trim();
    return [...editions]
      .filter((edition) => {
        if (!normalizedQuery) return true;
        const languageName = getLanguageName(edition.language, uiLanguage);
        return `${edition.name} ${languageName} ${edition.identifier}`
          .toLocaleLowerCase(uiLanguage)
          .includes(normalizedQuery);
      })
      .sort((left, right) => {
        const leftSelected = value.includes(left.identifier);
        const rightSelected = value.includes(right.identifier);
        if (leftSelected !== rightSelected) return leftSelected ? -1 : 1;
        if (left.language === uiLanguage && right.language !== uiLanguage) {
          return -1;
        }
        if (right.language === uiLanguage && left.language !== uiLanguage) {
          return 1;
        }
        return left.name.localeCompare(right.name, uiLanguage);
      });
  }, [editions, query, uiLanguage, value]);

  const handleToggle = (identifier) => {
    const isSelected = value.includes(identifier);
    if (isSelected) {
      if (value.length === 1) return;
      setLimitMessage("");
      onChange(value.filter((item) => item !== identifier));
      return;
    }

    if (value.length >= MAX_COMPARE_EDITIONS) {
      setLimitMessage(t("picker.maxReached", { max: MAX_COMPARE_EDITIONS }));
      return;
    }

    setLimitMessage("");
    onChange([...value, identifier]);
  };

  const closeGuide = () => {
    saveTranslationGuideSeen();
    setGuideOpen(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {t("picker.label")}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {t("picker.hint", { max: MAX_COMPARE_EDITIONS })}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setGuideOpen(true)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-primary-200 bg-primary-50 px-2.5 py-2 text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-100 dark:border-primary-800 dark:bg-primary-950/50 dark:text-primary-200 dark:hover:bg-primary-900/60"
        >
          <CircleHelp aria-hidden="true" className="h-4 w-4" />
          <span className="hidden sm:inline">{t("home.feature1Title")}</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2" aria-live="polite">
        {value.map((identifier) => {
          const edition = editionMap.get(identifier);
          return (
            <span
              key={identifier}
              className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1.5 text-xs font-semibold text-primary-800 dark:bg-primary-900/40 dark:text-primary-200"
            >
              <span>{edition?.name ?? identifier}</span>
              <button
                type="button"
                disabled={value.length === 1}
                onClick={() => handleToggle(identifier)}
                aria-label={t("picker.remove", {
                  name: edition?.name ?? identifier,
                })}
                className="rounded-full p-0.5 hover:bg-primary-200 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-primary-800"
              >
                <X aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
            </span>
          );
        })}
      </div>

      <details
        ref={pickerRef}
        className="group rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-gray-800 dark:text-gray-100">
          <span>{t("picker.selected", { count: value.length })}</span>
          <ChevronsUpDown aria-hidden="true" className="h-4 w-4 text-gray-500" />
        </summary>

        <div className="border-t border-gray-200 p-3 dark:border-gray-700">
          <label htmlFor={`${id}-search`} className="sr-only">
            {t("picker.search")}
          </label>
          <div className="relative">
            <Search
              aria-hidden="true"
              className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            />
            <input
              id={`${id}-search`}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("picker.search")}
              disabled={disabled}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pe-3 ps-9 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div className="mt-3 max-h-72 space-y-1 overflow-y-auto" id={id}>
            {visibleEditions.map((edition) => {
              const checked = value.includes(edition.identifier);
              return (
                <button
                  key={edition.identifier}
                  type="button"
                  role="checkbox"
                  aria-checked={checked}
                  disabled={disabled}
                  onClick={() => handleToggle(edition.identifier)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-start hover:bg-gray-100 disabled:cursor-wait disabled:opacity-60 dark:hover:bg-gray-700"
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                      checked
                        ? "border-primary-600 bg-primary-600 text-white"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {checked ? <Check className="h-3.5 w-3.5" /> : null}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-gray-900 dark:text-white">
                      {edition.name}
                    </span>
                    <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                      {getLanguageName(edition.language, uiLanguage)} · {edition.identifier}
                    </span>
                  </span>
                </button>
              );
            })}

            {visibleEditions.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                {t("picker.empty")}
              </p>
            ) : null}
          </div>
        </div>
      </details>

      {limitMessage ? (
        <p role="status" className="text-sm text-amber-700 dark:text-amber-300">
          {limitMessage}
        </p>
      ) : null}

      {createPortal(
        <AnimatePresence>
          {guideOpen ? (
            <motion.div
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                aria-hidden="true"
                onClick={closeGuide}
                className="absolute inset-0 cursor-default bg-gray-950/60 backdrop-blur-sm"
              />
              <motion.section
                role="dialog"
                aria-modal="true"
                aria-labelledby={`${id}-guide-title`}
                aria-describedby={`${id}-guide-description`}
                initial={{ opacity: 0, scale: 0.94, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 16 }}
                transition={{ type: "spring", stiffness: 340, damping: 28 }}
                className="glass relative z-10 w-full max-w-3xl rounded-3xl border border-primary-200 p-6 shadow-2xl dark:border-primary-800 md:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <motion.div
                      aria-hidden="true"
                      animate={{ scale: [1, 1.1, 1], rotate: [0, -6, 6, 0] }}
                      transition={{ duration: 2.4, repeat: Infinity }}
                      className="rounded-2xl bg-primary-100 p-3 text-primary-700 dark:bg-primary-900/50 dark:text-primary-200"
                    >
                      <Columns3 className="h-6 w-6" />
                    </motion.div>
                    <div>
                      <h2
                        id={`${id}-guide-title`}
                        className="text-2xl font-bold text-gray-900 dark:text-white"
                      >
                        {t("home.feature1Title")}
                      </h2>
                      <p
                        id={`${id}-guide-description`}
                        className="mt-2 text-sm text-gray-600 dark:text-gray-300"
                      >
                        {t("picker.hint", { max: MAX_COMPARE_EDITIONS })}
                      </p>
                    </div>
                  </div>
                  <button
                    ref={guideCloseRef}
                    type="button"
                    onClick={closeGuide}
                    aria-label={t("home.continue")}
                    className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <X aria-hidden="true" className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-7 grid gap-3 md:grid-cols-3">
                  {[
                    {
                      icon: Search,
                      title: t("picker.search"),
                      description: t("picker.label"),
                    },
                    {
                      icon: MousePointerClick,
                      title: t("picker.selected", { count: value.length }),
                      description: t("picker.hint", {
                        max: MAX_COMPARE_EDITIONS,
                      }),
                    },
                    {
                      icon: Columns3,
                      title: t("home.feature1Title"),
                      description: t("home.feature1Description"),
                    },
                  ].map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <motion.article
                        key={step.title}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12 + index * 0.1 }}
                        className="rounded-2xl border border-gray-200 bg-white/70 p-4 dark:border-gray-700 dark:bg-gray-900/50"
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                            {index + 1}
                          </span>
                          <Icon
                            aria-hidden="true"
                            className="h-5 w-5 text-primary-600 dark:text-primary-300"
                          />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                          {step.description}
                        </p>
                      </motion.article>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={closeGuide}
                  className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-primary-500 to-emerald-600 px-6 py-3 font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  {t("home.continue")}
                </button>
              </motion.section>
            </motion.div>
          ) : null}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

EditionSelect.propTypes = {
  editions: PropTypes.arrayOf(
    PropTypes.shape({
      identifier: PropTypes.string.isRequired,
      language: PropTypes.string,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string,
  disabled: PropTypes.bool,
};

export default EditionSelect;
