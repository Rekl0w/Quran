import { useMemo } from "react";
import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  LANGUAGE_NATIVE_NAMES,
  SUPPORTED_LANGUAGE_CODES,
} from "../lib/constants";
import { useReaderPreferences } from "../context/ReaderPreferencesContext";

const LanguageSelect = () => {
  const { t } = useTranslation();
  const { uiLanguage, setUiLanguage } = useReaderPreferences();
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

  return (
    <label className="relative flex items-center rounded-lg bg-gray-100 dark:bg-gray-800">
      <span className="sr-only">{t("common.language")}</span>
      <Languages
        aria-hidden="true"
        className="pointer-events-none absolute start-2 h-4 w-4 text-gray-600 dark:text-gray-300"
      />
      <select
        value={uiLanguage}
        onChange={(event) => setUiLanguage(event.target.value)}
        aria-label={t("common.language")}
        className="language-select w-[4.5rem] appearance-none rounded-lg bg-transparent py-2 pe-2 ps-7 text-sm font-semibold uppercase text-gray-700 outline-none focus:ring-2 focus:ring-primary-500 dark:text-gray-200 sm:w-36 sm:normal-case"
      >
        {languages.map((language) => (
          <option
            key={language.code}
            value={language.code}
            className="bg-white text-gray-900"
          >
            {language.code.toUpperCase()} · {language.label}
          </option>
        ))}
      </select>
    </label>
  );
};

export default LanguageSelect;
