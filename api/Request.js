import axios from "axios";

export const getSurahs = async (edition) => {
  try {
    const response = await axios.get(
      `http://api.alquran.cloud/v1/quran/${edition}`
    );
    return response.data.data.surahs;
  } catch (error) {
    console.error(error);
  }
};

export const getSurah = async (surahNumber, edition) => {
    try {
        const response = await axios.get(
          `http://api.alquran.cloud/v1/surah/${surahNumber}/${edition}`
        );
        return response.data.data;
    } catch (error) {
        console.error(error);
    }
    }

export const getEditions = async () => {
    try {
        const response = await axios.get("http://api.alquran.cloud/v1/edition");
        return response.data.data;
    } catch (error) {
        console.error(error);
    }
    }
