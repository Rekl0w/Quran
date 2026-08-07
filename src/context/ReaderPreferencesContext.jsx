import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import PropTypes from "prop-types";
import { activateLanguage } from "../i18n";
import {
  DEFAULT_UI_LANGUAGE,
  RTL_LANGUAGE_CODES,
  STORAGE_KEYS,
  SUPPORTED_LANGUAGE_CODES,
} from "../lib/constants";
import {
  getReaderPreferences,
  normalizeEditions,
  setReaderPreferences,
} from "../lib/utils";
import LoadingSkeleton from "../components/LoadingSkeleton";

const ReaderPreferencesContext = createContext(null);

export const ReaderPreferencesProvider = ({ children }) => {
  const [preferences, setPreferencesState] = useState(getReaderPreferences);
  const [languageReady, setLanguageReady] = useState(false);

  const setEditions = useCallback(
    (nextEditions) => {
      setPreferencesState((current) => {
        const value =
          typeof nextEditions === "function"
            ? nextEditions(current.editions)
            : nextEditions;
        const nextPreferences = {
          ...current,
          editions: normalizeEditions(value),
        };
        setReaderPreferences(nextPreferences);
        return nextPreferences;
      });
    },
    []
  );

  const setUiLanguage = useCallback((uiLanguage) => {
    setPreferencesState((current) => {
      const nextPreferences = {
        ...current,
        uiLanguage: SUPPORTED_LANGUAGE_CODES.includes(uiLanguage)
          ? uiLanguage
          : DEFAULT_UI_LANGUAGE,
      };
      setReaderPreferences(nextPreferences);
      return nextPreferences;
    });
  }, []);

  useEffect(() => {
    let active = true;
    setLanguageReady(false);
    document.documentElement.lang = preferences.uiLanguage;
    document.documentElement.dir = RTL_LANGUAGE_CODES.has(
      preferences.uiLanguage
    )
      ? "rtl"
      : "ltr";

    activateLanguage(preferences.uiLanguage)
      .catch((error) => {
        console.error("Interface language could not be loaded", error);
      })
      .finally(() => {
        if (active) setLanguageReady(true);
      });

    return () => {
      active = false;
    };
  }, [preferences.uiLanguage]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === STORAGE_KEYS.readerPreferences) {
        setPreferencesState(getReaderPreferences());
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const value = useMemo(
    () => ({
      editions: preferences.editions,
      primaryEdition: preferences.editions[0],
      uiLanguage: preferences.uiLanguage,
      setEditions,
      setUiLanguage,
    }),
    [preferences, setEditions, setUiLanguage]
  );

  return (
    <ReaderPreferencesContext.Provider value={value}>
      {languageReady ? children : <LoadingSkeleton />}
    </ReaderPreferencesContext.Provider>
  );
};

ReaderPreferencesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// The hook intentionally shares this module with its provider.
// eslint-disable-next-line react-refresh/only-export-components
export const useReaderPreferences = () => {
  const context = useContext(ReaderPreferencesContext);
  if (!context) {
    throw new Error("useReaderPreferences must be used inside its provider");
  }

  return context;
};
