import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getLanguageName } from "../lib/api";
import { MAX_COMPARE_EDITIONS } from "../lib/constants";
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

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {t("picker.label")}
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {t("picker.hint", { max: MAX_COMPARE_EDITIONS })}
        </p>
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

      <details className="group rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
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
