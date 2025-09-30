import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Volume2,
  Copy,
  Bookmark,
  BookmarkCheck,
  Share2,
} from "lucide-react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import {
  getSurah,
  getSurahAudioUrl,
  getAyahAudioUrl,
  getAyahImageUrl,
} from "../lib/api";
import {
  saveLastRead,
  isBookmarked,
  addBookmark,
  removeBookmark,
  copyToClipboard,
} from "../lib/utils";
import LoadingSpinner from "../components/LoadingSpinner";
import toast, { Toaster } from "react-hot-toast";

const SurahDetail = () => {
  const { number, edition } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [surah, setSurah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarks, setBookmarks] = useState({});

  useEffect(() => {
    const loadSurah = async () => {
      try {
        setLoading(true);
        const data = await getSurah(number, edition);
        setSurah(data);
        saveLastRead(number, edition);

        // Initialize bookmarks
        const bookmarksState = {};
        data.ayahs.forEach((ayah, index) => {
          bookmarksState[index + 1] = isBookmarked(parseInt(number), index + 1);
        });
        setBookmarks(bookmarksState);

        setError(null);
      } catch (err) {
        setError("Sure yüklenirken bir hata oluştu");
        console.error("Error loading surah:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSurah();
  }, [number, edition]);

  // Scroll to ayah if hash is present
  useEffect(() => {
    if (location.hash && !loading) {
      const ayahId = location.hash.replace("#", "");
      const element = document.getElementById(ayahId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 500);
      }
    }
  }, [location.hash, loading]);

  const handleCopyAyah = async (ayahText, ayahNumber) => {
    const success = await copyToClipboard(ayahText);
    if (success) {
      toast.success(`Ayet ${ayahNumber} kopyalandı!`);
    } else {
      toast.error("Kopyalama başarısız");
    }
  };

  const handleBookmark = (ayahNumber) => {
    const ayahIndex = ayahNumber;
    const currentlyBookmarked = bookmarks[ayahIndex];

    if (currentlyBookmarked) {
      removeBookmark(`${number}-${ayahIndex}`);
      toast.success("Yer imi kaldırıldı");
    } else {
      addBookmark(parseInt(number), ayahIndex, surah.englishName);
      toast.success("Yer imi eklendi");
    }

    setBookmarks({
      ...bookmarks,
      [ayahIndex]: !currentlyBookmarked,
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: `${surah.englishName} - ${surah.name}`,
      text: `Kuran-ı Kerim - ${surah.englishName} suresini okuyun`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success("Paylaşıldı!");
      } else {
        await copyToClipboard(window.location.href);
        toast.success("Link kopyalandı!");
      }
    } catch (err) {
      console.error("Share error:", err);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !surah) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400 mb-4">
          {error || "Sure bulunamadı"}
        </p>
        <button
          onClick={() => navigate("/surahs")}
          className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
        >
          Surelere Dön
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Toaster position="top-right" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <button
          onClick={() => navigate("/surahs")}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Surelere Dön</span>
        </button>

        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              {surah.englishName}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {surah.englishNameTranslation}
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span>
                {surah.revelationType === "Meccan" ? "Mekki" : "Medeni"}
              </span>
              <span>•</span>
              <span>{surah.numberOfAyahs} Ayet</span>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2">
            <h2 className="arabic-text text-4xl text-gray-800 dark:text-white font-bold">
              {surah.name}
            </h2>
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Paylaş</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Audio Player */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Volume2 className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Surenin Tamamını Dinle
          </h3>
        </div>
        <AudioPlayer
          src={getSurahAudioUrl(number)}
          className="rounded-xl"
          autoPlayAfterSrcChange={false}
          showJumpControls={false}
          customAdditionalControls={[]}
        />
      </motion.div>

      {/* Ayahs */}
      <div className="space-y-6">
        {surah.ayahs.map((ayah, index) => (
          <motion.div
            key={ayah.number}
            id={`ayah-${index + 1}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="glass rounded-2xl p-6 space-y-4 border border-gray-200 dark:border-gray-700 scroll-mt-24"
          >
            {/* Ayah Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-emerald-600 text-white font-bold text-sm">
                  {index + 1}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Ayet {index + 1}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopyAyah(ayah.text, index + 1)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title="Kopyala"
                >
                  <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => handleBookmark(index + 1)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title={
                    bookmarks[index + 1] ? "Yer imini kaldır" : "Yer imi ekle"
                  }
                >
                  {bookmarks[index + 1] ? (
                    <BookmarkCheck className="w-4 h-4 text-primary-600" />
                  ) : (
                    <Bookmark className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Translation */}
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-100">
              {ayah.text}
            </p>

            {/* Arabic Image */}
            <div className="flex justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
              <img
                src={getAyahImageUrl(number, index + 1)}
                alt={`Ayah ${index + 1}`}
                className="max-w-full h-auto dark:invert"
                loading="lazy"
              />
            </div>

            {/* Ayah Audio */}
            <div className="pt-4">
              <AudioPlayer
                src={getAyahAudioUrl(ayah.number)}
                className="rounded-lg"
                autoPlayAfterSrcChange={false}
                showJumpControls={false}
                customAdditionalControls={[]}
                layout="horizontal-reverse"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-8">
        {parseInt(number) > 1 && (
          <button
            onClick={() =>
              navigate(`/surah/${parseInt(number) - 1}/${edition}`)
            }
            className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Önceki Sure</span>
          </button>
        )}

        {parseInt(number) < 114 && (
          <button
            onClick={() =>
              navigate(`/surah/${parseInt(number) + 1}/${edition}`)
            }
            className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors ml-auto"
          >
            <span>Sonraki Sure</span>
            <ArrowLeft className="w-5 h-5 rotate-180" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SurahDetail;
