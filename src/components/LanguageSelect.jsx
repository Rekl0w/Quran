import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Languages, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  LANGUAGE_NATIVE_NAMES,
  SUPPORTED_LANGUAGE_CODES,
} from "../lib/constants";
import { useReaderPreferences } from "../context/ReaderPreferencesContext";

const LanguageSelect = () => {
  const { t } = useTranslation();
  const { uiLanguage, setUiLanguage } = useReaderPreferences();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);
  const searchRef = useRef(null);
  const languages = useMemo(
    () =>
      SUPPORTED_LANGUAGE_CODES.map((code) => ({
        code,
        label: LANGUAGE_NATIVE_NAMES[code],
      })).sort((left, right) =>
        left.label.localeCompare(right.label, uiLanguage)
      ),
    [uiLanguage]
  );
  const visibleLanguages = useMemo(() => {
    const normalizedQuery = query.toLocaleLowerCase(uiLanguage).trim();
    if (!normalizedQuery) return languages;

    return languages.filter((language) =>
      `${language.code} ${language.label}`
        .toLocaleLowerCase(uiLanguage)
        .includes(normalizedQuery)
    );
  }, [languages, query, uiLanguage]);

  useEffect(() => {
    if (!open) return undefined;

    const focusTimer = window.setTimeout(() => searchRef.current?.focus(), 0);

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
        setQuery("");
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const activeLanguage = LANGUAGE_NATIVE_NAMES[uiLanguage];

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => {
          if (open) setQuery("");
          setOpen((current) => !current);
        }}
        aria-label={t("common.language")}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-lg border border-transparent bg-gray-100 px-2 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-primary-200 hover:bg-primary-50 focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-primary-800 dark:hover:bg-gray-700 sm:px-3"
      >
        <Languages aria-hidden="true" className="h-4 w-4 shrink-0" />
        <span className="uppercase sm:hidden">{uiLanguage}</span>
        <span className="hidden max-w-32 truncate sm:inline">
          {uiLanguage.toUpperCase()} · {activeLanguage}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <div
          className="absolute end-0 top-[calc(100%+0.5rem)] z-[70] w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="border-b border-gray-200 p-2 dark:border-gray-700">
            <label htmlFor="language-search" className="sr-only">
              {t("picker.search")}
            </label>
            <div className="relative">
              <Search
                aria-hidden="true"
                className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              />
              <input
                ref={searchRef}
                id="language-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("picker.search")}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pe-3 ps-9 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div
            role="listbox"
            aria-label={t("common.language")}
            className="max-h-[min(60vh,27rem)] overflow-y-auto p-2"
          >
            {visibleLanguages.map((language) => {
              const selected = language.code === uiLanguage;
              return (
                <button
                  key={language.code}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    setOpen(false);
                    setQuery("");
                    if (!selected) setUiLanguage(language.code);
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-start text-sm transition-colors ${
                    selected
                      ? "bg-primary-100 font-semibold text-primary-800 dark:bg-primary-900/40 dark:text-primary-200"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <span className="w-8 shrink-0 uppercase text-gray-500 dark:text-gray-400">
                    {language.code}
                  </span>
                  <span className="min-w-0 flex-1 truncate" lang={language.code}>
                    {language.label}
                  </span>
                  {selected ? (
                    <Check aria-hidden="true" className="h-4 w-4 shrink-0" />
                  ) : null}
                </button>
              );
            })}

            {visibleLanguages.length === 0 ? (
              <p
                role="status"
                className="px-3 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
              >
                {t("picker.empty")}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default LanguageSelect;
