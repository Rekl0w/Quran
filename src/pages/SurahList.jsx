import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, BookOpen, MapPin } from "lucide-react";
import { getSurahs, getEditions, searchSurahs } from "../lib/api";
import { formatRevelationType } from "../lib/utils";
import LoadingSpinner from "../components/LoadingSpinner";

const SurahList = () => {
  const [surahs, setSurahs] = useState([]);
  const [filteredSurahs, setFilteredSurahs] = useState([]);
  const [editions, setEditions] = useState([]);
  const [selectedEdition, setSelectedEdition] = useState("tr.yazir");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEditions = async () => {
      try {
        const data = await getEditions();
        setEditions(data);
      } catch (err) {
        console.error("Error loading editions:", err);
      }
    };

    loadEditions();
  }, []);

  useEffect(() => {
    const loadSurahs = async () => {
      try {
        setLoading(true);
        const data = await getSurahs(selectedEdition);
        setSurahs(data);
        setFilteredSurahs(data);
        setError(null);
      } catch (err) {
        setError("Sureler yüklenirken bir hata oluştu");
        console.error("Error loading surahs:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSurahs();
  }, [selectedEdition]);

  useEffect(() => {
    const filtered = searchSurahs(surahs, searchQuery);
    setFilteredSurahs(filtered);
  }, [searchQuery, surahs]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h1 className="text-4xl md:text-5xl font-bold gradient-text">
          Sureler
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Kuran-ı Kerim'in 114 suresini keşfedin
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Sure ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
          </div>

          {/* Edition Selector */}
          <select
            value={selectedEdition}
            onChange={(e) => setSelectedEdition(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          >
            {editions.map((edition) => (
              <option key={edition.identifier} value={edition.identifier}>
                {edition.language} - {edition.name}
              </option>
            ))}
          </select>
        </div>

        {searchQuery && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {filteredSurahs.length} sure bulundu
          </p>
        )}
      </motion.div>

      {/* Surah Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSurahs.map((surah, index) => (
          <motion.div
            key={surah.number}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
          >
            <Link
              to={`/surah/${surah.number}/${selectedEdition}`}
              className="block glass rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-emerald-600 text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                      {surah.number}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {surah.englishName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {surah.englishNameTranslation}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="arabic-text text-2xl text-gray-800 dark:text-white font-bold">
                  {surah.name}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{formatRevelationType(surah.revelationType)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{surah.numberOfAyahs} Ayet</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {filteredSurahs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            Aradığınız kriterlere uygun sure bulunamadı.
          </p>
        </div>
      )}
    </div>
  );
};

export default SurahList;
