import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bookmark, Trash2, BookOpen } from "lucide-react";
import { getBookmarks, removeBookmark } from "../lib/utils";
import toast, { Toaster } from "react-hot-toast";

const Bookmarks = () => {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = () => {
    const data = getBookmarks();
    setBookmarks(data);
  };

  const handleRemoveBookmark = (id) => {
    removeBookmark(id);
    loadBookmarks();
    toast.success("Yer imi kaldırıldı");
  };

  const handleGoToAyah = (surahNumber, ayahNumber) => {
    navigate(`/surah/${surahNumber}/tr.diyanet#ayah-${ayahNumber}`);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-8">
      <Toaster position="top-right" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center space-x-3">
          <Bookmark className="w-10 h-10 text-primary-600 dark:text-primary-400" />
          <div>
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">
              Yer İmleri
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Kaydettiğiniz ayetler
            </p>
          </div>
        </div>
      </motion.div>

      {/* Bookmarks List */}
      {bookmarks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700"
        >
          <Bookmark className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Henüz yer imi yok
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Ayetleri okurken yer imi ekleyerek daha sonra kolayca
            erişebilirsiniz
          </p>
          <Link
            to="/surahs"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            <BookOpen className="w-5 h-5" />
            <span>Surelere Git</span>
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Toplam {bookmarks.length} yer imi
          </p>

          <div className="grid grid-cols-1 gap-4">
            {bookmarks.map((bookmark, index) => (
              <motion.div
                key={bookmark.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-emerald-600 text-white font-bold shadow-lg">
                        {bookmark.surahNumber}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {bookmark.surahName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Ayet {bookmark.ayahNumber}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
                      {formatDate(bookmark.timestamp)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        handleGoToAyah(
                          bookmark.surahNumber,
                          bookmark.ayahNumber
                        )
                      }
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                    >
                      Ayete Git
                    </button>
                    <button
                      onClick={() => handleRemoveBookmark(bookmark.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Yer imini kaldır"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
