import {
  DEFAULT_EDITION,
  DEFAULT_UI_LANGUAGE,
  MAX_COMPARE_EDITIONS,
  STORAGE_KEYS,
  SUPPORTED_LANGUAGE_CODES,
} from "./constants";

const canUseStorage = () => typeof window !== "undefined" && window.localStorage;

const readJson = (key, fallback) => {
  if (!canUseStorage()) return fallback;

  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn(`Geçersiz yerel veri yok sayıldı: ${key}`, error);
    return fallback;
  }
};

const writeJson = (key, value) => {
  if (!canUseStorage()) return false;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Yerel veri kaydedilemedi: ${key}`, error);
    return false;
  }
};

const isValidSurahNumber = (value) =>
  Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) <= 114;

const isValidAyahNumber = (value) =>
  Number.isInteger(Number(value)) && Number(value) >= 1;

const EDITION_PATTERN = /^[a-z0-9._-]+$/i;

export const normalizeEditions = (value, fallback = [DEFAULT_EDITION]) => {
  const candidates = Array.isArray(value) ? value : [value];
  const editions = candidates
    .filter(
      (edition) =>
        typeof edition === "string" && EDITION_PATTERN.test(edition)
    )
    .filter((edition, index, list) => list.indexOf(edition) === index)
    .slice(0, MAX_COMPARE_EDITIONS);

  return editions.length > 0 ? editions : [...fallback];
};

export const encodeEditions = (editions) => normalizeEditions(editions).join(",");

export const parseEditionsParam = (value, fallback) =>
  normalizeEditions(
    typeof value === "string" ? value.split(",") : value,
    normalizeEditions(fallback)
  );

export const getReaderPreferences = () => {
  const preferences = readJson(STORAGE_KEYS.readerPreferences, {});
  const legacyEdition =
    typeof preferences?.edition === "string" ? preferences.edition : null;
  const uiLanguage = SUPPORTED_LANGUAGE_CODES.includes(preferences?.uiLanguage)
    ? preferences.uiLanguage
    : DEFAULT_UI_LANGUAGE;

  return {
    editions: normalizeEditions(preferences?.editions ?? legacyEdition),
    uiLanguage,
  };
};

export const setReaderPreferences = ({ editions, uiLanguage }) =>
  writeJson(STORAGE_KEYS.readerPreferences, {
    version: 2,
    editions: normalizeEditions(editions),
    uiLanguage: SUPPORTED_LANGUAGE_CODES.includes(uiLanguage)
      ? uiLanguage
      : DEFAULT_UI_LANGUAGE,
  });

export const getDarkModePreference = () => {
  const saved = readJson(STORAGE_KEYS.darkMode, null);
  if (typeof saved === "boolean") return saved;

  return false;
};

export const saveDarkModePreference = (enabled) =>
  writeJson(STORAGE_KEYS.darkMode, Boolean(enabled));

export const getTranslationGuideSeen = () =>
  readJson(STORAGE_KEYS.translationGuideSeen, false) === true;

export const saveTranslationGuideSeen = () =>
  writeJson(STORAGE_KEYS.translationGuideSeen, true);

export const getBookmarkId = (surahNumber, ayahNumber, editions) =>
  `${Number(surahNumber)}:${Number(ayahNumber)}:${encodeEditions(editions)}`;

const normalizeBookmark = (bookmark, fallbackEditions) => {
  if (
    !bookmark ||
    !isValidSurahNumber(bookmark.surahNumber) ||
    !isValidAyahNumber(bookmark.ayahNumber)
  ) {
    return null;
  }

  const editions = normalizeEditions(
    bookmark.editions ?? bookmark.edition,
    normalizeEditions(fallbackEditions)
  );

  return {
    id: getBookmarkId(bookmark.surahNumber, bookmark.ayahNumber, editions),
    surahNumber: Number(bookmark.surahNumber),
    ayahNumber: Number(bookmark.ayahNumber),
    surahName:
      typeof bookmark.surahName === "string" ? bookmark.surahName : "Sure",
    editions,
    excerpt: typeof bookmark.excerpt === "string" ? bookmark.excerpt : "",
    timestamp:
      typeof bookmark.timestamp === "string"
        ? bookmark.timestamp
        : new Date().toISOString(),
  };
};

export const getBookmarks = (
  fallbackEditions = getReaderPreferences().editions
) => {
  const stored = readJson(STORAGE_KEYS.bookmarks, []);
  if (!Array.isArray(stored)) return [];

  return stored
    .map((bookmark) => normalizeBookmark(bookmark, fallbackEditions))
    .filter(Boolean);
};

export const addBookmark = (bookmark) => {
  const bookmarks = getBookmarks(bookmark.editions);
  const normalized = normalizeBookmark(bookmark, bookmark.editions);

  if (!normalized || bookmarks.some((item) => item.id === normalized.id)) {
    return { bookmarks, saved: Boolean(normalized) };
  }

  const nextBookmarks = [normalized, ...bookmarks];
  return {
    bookmarks: nextBookmarks,
    saved: writeJson(STORAGE_KEYS.bookmarks, nextBookmarks),
  };
};

export const removeBookmark = (
  id,
  fallbackEditions = getReaderPreferences().editions
) => {
  const nextBookmarks = getBookmarks(fallbackEditions).filter(
    (bookmark) => bookmark.id !== id
  );

  return {
    bookmarks: nextBookmarks,
    saved: writeJson(STORAGE_KEYS.bookmarks, nextBookmarks),
  };
};

export const saveLastRead = ({
  surahNumber,
  editions,
  surahName,
  ayahNumber = 1,
}) => {
  if (!isValidSurahNumber(surahNumber) || !isValidAyahNumber(ayahNumber)) {
    return false;
  }

  return writeJson(STORAGE_KEYS.lastRead, {
    version: 2,
    surahNumber: Number(surahNumber),
    ayahNumber: Number(ayahNumber),
    editions: normalizeEditions(editions),
    surahName,
    timestamp: new Date().toISOString(),
  });
};

export const getLastRead = () => {
  const lastRead = readJson(STORAGE_KEYS.lastRead, null);
  if (!lastRead || !isValidSurahNumber(lastRead.surahNumber)) return null;

  return {
    surahNumber: Number(lastRead.surahNumber),
    ayahNumber: isValidAyahNumber(lastRead.ayahNumber)
      ? Number(lastRead.ayahNumber)
      : 1,
    editions: normalizeEditions(
      lastRead.editions ?? lastRead.edition,
      getReaderPreferences().editions
    ),
    surahName:
      typeof lastRead.surahName === "string" ? lastRead.surahName : "Sure",
    timestamp:
      typeof lastRead.timestamp === "string" ? lastRead.timestamp : null,
  };
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Kopyalama başarısız:", error);
    return false;
  }
};
