import axios from "axios";

const BASE_URL = "https://api.alquran.cloud/v1";
const CDN_URL = "https://cdn.islamic.network";

// Get all editions/translations
export const getEditions = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/edition`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching editions:", error);
    throw error;
  }
};

// Get all surahs for a specific edition
export const getSurahs = async (edition = "tr.yazir") => {
  try {
    const response = await axios.get(`${BASE_URL}/quran/${edition}`);
    return response.data.data.surahs;
  } catch (error) {
    console.error("Error fetching surahs:", error);
    throw error;
  }
};

// Get a specific surah
export const getSurah = async (surahNumber, edition = "tr.yazir") => {
  try {
    const response = await axios.get(
      `${BASE_URL}/surah/${surahNumber}/${edition}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching surah:", error);
    throw error;
  }
};

// Get surah audio URL
export const getSurahAudioUrl = (surahNumber) => {
  return `${CDN_URL}/quran/audio-surah/128/ar.alafasy/${surahNumber}.mp3`;
};

// Get ayah audio URL
export const getAyahAudioUrl = (ayahNumber) => {
  return `${CDN_URL}/quran/audio/128/ar.alafasy/${ayahNumber}.mp3`;
};

// Get ayah image URL
export const getAyahImageUrl = (surahNumber, ayahNumber) => {
  return `${CDN_URL}/quran/images/${surahNumber}_${ayahNumber}.png`;
};

// Search surahs
export const searchSurahs = (surahs, query) => {
  if (!query) return surahs;

  const lowerQuery = query.toLowerCase();
  return surahs.filter(
    (surah) =>
      surah.englishName.toLowerCase().includes(lowerQuery) ||
      surah.name.includes(query) ||
      surah.number.toString().includes(query) ||
      surah.englishNameTranslation.toLowerCase().includes(lowerQuery)
  );
};
