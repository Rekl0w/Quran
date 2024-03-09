import axios from "axios";

export const getSurahs = async (edition) => {
  try {
    const response = await axios.get(
      `https://api.alquran.cloud/v1/quran/${edition}`
    );
    return response.data.data.surahs;
  } catch (error) {
    console.error(error);
  }
};

export const getSurah = async (surahNumber, edition) => {
  try {
    const response = await axios.get(
      `https://api.alquran.cloud/v1/surah/${surahNumber}/${edition}`
    );
    return response.data.data;
  } catch (error) {
    console.error(error);
  }
};

export const getEditions = async () => {
  try {
    const response = await axios.get("https://api.alquran.cloud/v1/edition");
    return response.data.data;
  } catch (error) {
    console.error(error);
  }
};

export const getAyahPng = async (surahNumber, ayahNumber) => {
  try {
    const response = await axios.get(
      `https://cdn.islamic.network/quran/images/high-resolution/${surahNumber}_${ayahNumber}.png`
    );
    return response.data.data;
  } catch (error) {
    console.error(error);
  }
};

export const getSurahAudio = async (surahNumber) => {
  try {
    const response = await axios.get(
      `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNumber}.mp3`,
      {
        responseType: "blob",
        Origin: "*",
      }
    );
    return response.data.data;
  } catch (error) {
    console.error(error);
  }
};

export const getAyahAudio = async (ayahNumber) => {
  try {
    const response = await axios.get(
      `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahNumber}.mp3`
    );
    return response.data.data;
  } catch (error) {
    console.error(error);
  }
};
