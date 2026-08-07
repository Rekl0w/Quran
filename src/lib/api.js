import axios from "axios";
import { getSurahLocalization } from "../data/surah-localizations";
import { getLocalizedSurahNames } from "../data/surah-names";
import {
  ARABIC_EDITION,
  DEFAULT_EDITION,
  DEFAULT_RECITER,
  DEFAULT_UI_LANGUAGE,
  MAX_COMPARE_EDITIONS,
} from "./constants";
import { normalizeEditions } from "./utils";

const apiClient = axios.create({
  baseURL: "https://api.alquran.cloud/v1",
  timeout: 15000,
});

const CDN_URL = "https://cdn.islamic.network";
const EDITION_PATTERN = /^[a-z0-9._-]+$/i;

let editionsCache = null;
let editionsRequest = null;
let baseSurahsCache = null;
let baseSurahsRequest = null;

const createApiError = (code, message) => {
  const error = new Error(message);
  error.code = code;
  return error;
};

const normalizeForSearch = (value, language = DEFAULT_UI_LANGUAGE) =>
  String(value ?? "")
    .toLocaleLowerCase(language)
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[’'_-]/g, " ")
    .trim();

const getBaseSurahs = async () => {
  if (baseSurahsCache) return baseSurahsCache;
  if (baseSurahsRequest) return baseSurahsRequest;

  baseSurahsRequest = apiClient
    .get("/surah")
    .then((response) => {
      if (!Array.isArray(response.data?.data)) {
        throw createApiError(
          "INVALID_SURAH_LIST",
          "The surah list has an unexpected format"
        );
      }

      baseSurahsCache = response.data.data;
      return baseSurahsCache;
    })
    .finally(() => {
      baseSurahsRequest = null;
    });

  return baseSurahsRequest;
};

const localizeSurah = (surah, localizedNames) => {
  const turkishLocalization = getSurahLocalization(surah.number);

  return {
    ...surah,
    localizedName: localizedNames[surah.number - 1],
    name: turkishLocalization?.arabicName || surah.name,
    numberOfAyahs:
      surah.numberOfAyahs ??
      turkishLocalization?.ayahCount ??
      0,
  };
};

export const isRequestCanceled = (error) =>
  axios.isCancel(error) || error?.code === "ERR_CANCELED";

export const getEditions = async () => {
  if (editionsCache) return editionsCache;
  if (editionsRequest) return editionsRequest;

  editionsRequest = apiClient
    .get("/edition")
    .then((response) => {
      const editions = Array.isArray(response.data?.data)
        ? response.data.data
        : [];

      editionsCache = editions.filter(
        (edition) =>
          edition.format === "text" && edition.type === "translation"
      );

      return editionsCache;
    })
    .finally(() => {
      editionsRequest = null;
    });

  return editionsRequest;
};

export const getSurahs = async (language = DEFAULT_UI_LANGUAGE) => {
  const [surahs, localizedNames] = await Promise.all([
    getBaseSurahs(),
    getLocalizedSurahNames(language),
  ]);

  return surahs.map((surah) =>
    localizeSurah(surah, localizedNames)
  );
};

export const getSurah = async (
  surahNumber,
  selectedEditions = [DEFAULT_EDITION],
  { signal, language = DEFAULT_UI_LANGUAGE } = {}
) => {
  const parsedNumber = Number(surahNumber);
  const editions = normalizeEditions(selectedEditions);
  if (
    !Number.isInteger(parsedNumber) ||
    parsedNumber < 1 ||
    parsedNumber > 114 ||
    editions.length > MAX_COMPARE_EDITIONS ||
    editions.some(
      (edition) =>
        !EDITION_PATTERN.test(edition) || edition === ARABIC_EDITION
    )
  ) {
    throw createApiError(
      "INVALID_SURAH_SELECTION",
      "Invalid surah or translation selection"
    );
  }

  const identifiers = [ARABIC_EDITION, ...editions]
    .filter((identifier, index, list) => list.indexOf(identifier) === index)
    .map(encodeURIComponent)
    .join(",");

  const [response, localizedNames] = await Promise.all([
    apiClient.get(`/surah/${parsedNumber}/editions/${identifiers}`, {
      signal,
    }),
    getLocalizedSurahNames(language),
  ]);
  const responseEditions = Array.isArray(response.data?.data)
    ? response.data.data
    : [];
  const arabic = responseEditions.find(
    (item) => item.edition?.identifier === ARABIC_EDITION
  );
  const translations = editions.map((identifier) =>
    responseEditions.find((item) => item.edition?.identifier === identifier)
  );

  if (
    !arabic ||
    translations.some(
      (translation) =>
        !translation ||
        translation.edition?.format !== "text" ||
        translation.edition?.type !== "translation"
    )
  ) {
    throw createApiError(
      "TRANSLATION_UNAVAILABLE",
      "One or more selected translations are unavailable"
    );
  }

  const localized = localizeSurah(arabic, localizedNames);
  return {
    ...arabic,
    localizedName: localized.localizedName,
    name: localized.name,
    numberOfAyahs: arabic.ayahs.length,
    translations: translations.map((translation) => translation.edition),
    ayahs: arabic.ayahs.map((ayah, index) => ({
      number: ayah.number,
      numberInSurah: ayah.numberInSurah ?? index + 1,
      arabicText: ayah.text,
      translations: translations.map((translation) => ({
        edition: translation.edition,
        text: translation.ayahs[index]?.text ?? "",
      })),
    })),
  };
};

export const getSurahAudioUrl = (surahNumber) =>
  `${CDN_URL}/quran/audio-surah/128/${DEFAULT_RECITER}/${surahNumber}.mp3`;

export const getAyahAudioUrl = (ayahNumber) =>
  `${CDN_URL}/quran/audio/128/${DEFAULT_RECITER}/${ayahNumber}.mp3`;

export const searchSurahs = (surahs, query, language = DEFAULT_UI_LANGUAGE) => {
  const normalizedQuery = normalizeForSearch(query, language);
  if (!normalizedQuery) return surahs;

  const isNumeric = /^\d+$/.test(normalizedQuery);
  const numericQuery = isNumeric ? Number(normalizedQuery) : null;

  return surahs.filter((surah) => {
    if (
      isNumeric &&
      (surah.number === numericQuery || surah.numberOfAyahs === numericQuery)
    ) {
      return true;
    }

    return [
      surah.localizedName,
      surah.name,
      surah.englishName,
      surah.englishNameTranslation,
    ].some((value) =>
      normalizeForSearch(value, language).includes(normalizedQuery)
    );
  });
};

export const getLanguageName = (
  languageCode,
  displayLanguage = DEFAULT_UI_LANGUAGE
) => {
  try {
    return (
      new Intl.DisplayNames([displayLanguage], { type: "language" }).of(
        languageCode
      ) || languageCode.toUpperCase()
    );
  } catch {
    return languageCode.toUpperCase();
  }
};
