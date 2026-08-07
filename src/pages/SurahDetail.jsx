import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "../lib/router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CirclePlay,
  Info,
  ListMusic,
  RefreshCw,
  Share2,
  Volume2,
} from "lucide-react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  getAyahAudioUrl,
  getEditions,
  getSurah,
  getSurahAudioUrl,
  isRequestCanceled,
} from "../lib/api";
import {
  addBookmark,
  copyToClipboard,
  encodeEditions,
  getBookmarkId,
  getBookmarks,
  parseEditionsParam,
  removeBookmark,
  saveLastRead,
} from "../lib/utils";
import { useReaderPreferences } from "../context/ReaderPreferencesContext";
import AyahCard from "../components/AyahCard";
import EditionSelect from "../components/EditionSelect";
import LoadingSkeleton from "../components/LoadingSkeleton";

const EMPTY_CONTROLS = [];

const SurahDetail = () => {
  const { number, editions: editionParam } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const {
    editions: preferredEditions,
    setEditions,
    uiLanguage,
  } = useReaderPreferences();
  const preferredEditionKey = encodeEditions(preferredEditions);
  const routeEditionKey = useMemo(
    () =>
      encodeEditions(
        parseEditionsParam(editionParam, preferredEditionKey.split(","))
      ),
    [editionParam, preferredEditionKey]
  );
  const routeEditions = useMemo(
    () => routeEditionKey.split(","),
    [routeEditionKey]
  );

  const [surah, setSurah] = useState(null);
  const [availableEditions, setAvailableEditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editionError, setEditionError] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState({});
  const [activeAyah, setActiveAyah] = useState(null);
  const [retryToken, setRetryToken] = useState(0);
  const audioPlayerRef = useRef(null);

  useEffect(() => {
    if (preferredEditionKey !== routeEditionKey) {
      setEditions(routeEditions);
    }
  }, [preferredEditionKey, routeEditionKey, routeEditions, setEditions]);

  useEffect(() => {
    let active = true;

    getEditions()
      .then((editions) => {
        if (active) setAvailableEditions(editions);
      })
      .catch((loadError) => {
        if (!active) return;
        console.error("Translation choices could not be loaded", loadError);
        setEditionError(true);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const loadSurah = async () => {
      setLoading(true);
      setError(null);
      setSurah(null);
      setActiveAyah(null);

      try {
        const data = await getSurah(number, routeEditions, {
          signal: controller.signal,
          language: uiLanguage,
        });
        if (!active) return;

        const bookmarkSet = new Set(
          getBookmarks(routeEditions).map((bookmark) => bookmark.id)
        );
        const nextBookmarkedIds = Object.fromEntries(
          data.ayahs.map((ayah) => {
            const bookmarkId = getBookmarkId(
              number,
              ayah.numberInSurah,
              routeEditions
            );
            return [bookmarkId, bookmarkSet.has(bookmarkId)];
          })
        );

        setSurah(data);
        setBookmarkedIds(nextBookmarkedIds);
        saveLastRead({
          surahNumber: number,
          ayahNumber: 1,
          editions: routeEditions,
          surahName: data.localizedName,
        });
      } catch (loadError) {
        if (!active || isRequestCanceled(loadError)) return;

        console.error("Surah could not be loaded", loadError);
        setError(
          loadError.code === "INVALID_SURAH_SELECTION" ||
            loadError.code === "TRANSLATION_UNAVAILABLE"
            ? "detail.invalid"
            : "detail.loadError"
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    loadSurah();
    return () => {
      active = false;
      controller.abort();
    };
  }, [
    number,
    retryToken,
    routeEditionKey,
    routeEditions,
    uiLanguage,
  ]);

  useEffect(() => {
    if (!location.hash || loading || !surah) return undefined;

    const ayahId = location.hash.slice(1);
    const timer = window.setTimeout(() => {
      document.getElementById(ayahId)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 150);

    return () => window.clearTimeout(timer);
  }, [location.hash, loading, surah]);

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [location.hash, number]);

  const activeAudioUrl = useMemo(
    () =>
      activeAyah
        ? getAyahAudioUrl(activeAyah.number)
        : getSurahAudioUrl(number),
    [activeAyah, number]
  );

  const handleCopyAyah = useCallback(
    async (ayahText, ayahNumber) => {
      const success = await copyToClipboard(ayahText);
      toast[success ? "success" : "error"](
        t(success ? "detail.copied" : "detail.copyFailed", {
          number: ayahNumber,
        })
      );
    },
    [t]
  );

  const handleBookmark = useCallback(
    (ayah) => {
      if (!surah) return;

      const bookmarkId = getBookmarkId(
        number,
        ayah.numberInSurah,
        routeEditions
      );
      const currentlyBookmarked = Boolean(bookmarkedIds[bookmarkId]);
      const result = currentlyBookmarked
        ? removeBookmark(bookmarkId, routeEditions)
        : addBookmark({
            surahNumber: number,
            ayahNumber: ayah.numberInSurah,
            surahName: surah.localizedName,
            editions: routeEditions,
            excerpt: ayah.translations[0]?.text ?? "",
            timestamp: new Date().toISOString(),
          });

      if (!result.saved) {
        toast.error(t("detail.bookmarkFailed"));
        return;
      }

      setBookmarkedIds((current) => ({
        ...current,
        [bookmarkId]: !currentlyBookmarked,
      }));
      toast.success(
        t(
          currentlyBookmarked
            ? "detail.bookmarkRemoved"
            : "detail.bookmarkAdded"
        )
      );
    },
    [bookmarkedIds, number, routeEditions, surah, t]
  );

  const playCurrentAudio = useCallback(() => {
    const playPromise = audioPlayerRef.current?.audio?.current?.play();
    playPromise?.catch((playError) => {
      console.warn("Audio playback could not be started", playError);
    });
  }, []);

  const handlePlayFullSurah = useCallback(() => {
    if (activeAyah) {
      setActiveAyah(null);
      return;
    }

    playCurrentAudio();
  }, [activeAyah, playCurrentAudio]);

  const handlePlayAyah = useCallback(
    (ayah) => {
      if (!surah) return;

      if (activeAyah?.number === ayah.number) {
        playCurrentAudio();
      } else {
        setActiveAyah(ayah);
      }
      saveLastRead({
        surahNumber: number,
        ayahNumber: ayah.numberInSurah,
        editions: routeEditions,
        surahName: surah.localizedName,
      });
    },
    [activeAyah, number, playCurrentAudio, routeEditions, surah]
  );

  const handleEditionChange = useCallback(
    (nextEditions) => {
      setEditions(nextEditions);
      navigate(
        `/surah/${number}/${encodeEditions(nextEditions)}${location.hash}`
      );
    },
    [location.hash, navigate, number, setEditions]
  );

  const handleShare = async () => {
    if (!surah) return;

    const title = t("common.surahName", { name: surah.localizedName });
    const shareData = {
      title,
      text: `${t("appName")} — ${title}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success(t("detail.shared"));
        return;
      }

      const copied = await copyToClipboard(window.location.href);
      toast[copied ? "success" : "error"](
        t(copied ? "detail.linkCopied" : "detail.linkCopyFailed")
      );
    } catch (shareError) {
      if (shareError?.name === "AbortError") return;
      console.error("Sharing failed", shareError);
      toast.error(t("detail.shareFailed"));
    }
  };

  if (loading) {
    return <LoadingSkeleton variant="detail" />;
  }

  if (error || !surah) {
    return (
      <section className="py-12 text-center" role="alert">
        <p className="mb-5 text-red-600 dark:text-red-400">
          {t(error || "detail.notFound")}
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate("/surahs")}
            className="rounded-xl border border-gray-300 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800"
          >
            {t("common.backToSurahs")}
          </button>
          <button
            type="button"
            onClick={() => setRetryToken((value) => value + 1)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-white transition-colors hover:bg-primary-700"
          >
            <RefreshCw aria-hidden="true" className="h-5 w-5" />
            {t("common.retry")}
          </button>
          {preferredEditionKey !== routeEditionKey ? (
            <button
              type="button"
              onClick={() =>
                navigate(`/surah/${number}/${preferredEditionKey}`)
              }
              className="rounded-xl bg-primary-600 px-6 py-3 text-white transition-colors hover:bg-primary-700"
            >
              {t("detail.openPreferred")}
            </button>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-8 pb-24">
      <header className="space-y-5">
        <button
          type="button"
          onClick={() => navigate("/surahs")}
          className="flex items-center gap-2 text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
        >
          <ArrowLeft aria-hidden="true" className="h-5 w-5 rtl:rotate-180" />
          <span>{t("common.backToSurahs")}</span>
        </button>

        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
              {t("common.surahName", { name: surah.localizedName })}
            </h1>
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-300">
              <span>
                {t(
                  surah.revelationType === "Meccan"
                    ? "common.meccan"
                    : "common.medinan"
                )}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {t("common.ayahCountLabel", { value: surah.numberOfAyahs })}
              </span>
            </div>
            <p className="text-sm font-medium text-primary-700 dark:text-primary-300">
              {t("detail.activeTranslations", {
                names: surah.translations.map((edition) => edition.name).join(", "),
              })}
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 md:items-end">
            <p
              lang="ar"
              dir="rtl"
              className="arabic-text text-4xl font-bold text-gray-800 dark:text-white"
            >
              {surah.name}
            </p>
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <Share2 aria-hidden="true" className="h-4 w-4" />
              <span>{t("common.share")}</span>
            </button>
          </div>
        </div>

        <div className="max-w-3xl">
          <EditionSelect
            id="detail-editions"
            editions={availableEditions}
            value={routeEditions}
            onChange={handleEditionChange}
            disabled={availableEditions.length === 0}
          />
          {editionError ? (
            <p
              className="mt-2 text-sm text-amber-700 dark:text-amber-300"
              role="status"
            >
              {t("picker.unavailable")}
            </p>
          ) : null}
        </div>
      </header>

      <motion.section
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl p-5 md:p-6"
        aria-label={t("detail.audio")}
      >
        <button
          type="button"
          onClick={handlePlayFullSurah}
          aria-pressed={!activeAyah}
          className="group mb-4 flex w-full items-center justify-between gap-4 rounded-2xl border border-primary-200 bg-primary-50/80 p-4 text-start transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:bg-primary-100 hover:shadow-md dark:border-primary-800 dark:bg-primary-950/40 dark:hover:border-primary-700 dark:hover:bg-primary-900/50"
        >
          <span className="flex items-center gap-3">
            <span className="rounded-xl bg-primary-600 p-2.5 text-white shadow-sm">
              <Volume2 aria-hidden="true" className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-semibold text-gray-900 dark:text-white">
                {t("detail.listenFull")}
              </span>
              <span className="block text-xs text-gray-500 dark:text-gray-400">
                {t("detail.reciter")}
              </span>
            </span>
          </span>
          <CirclePlay
            aria-hidden="true"
            className="h-7 w-7 shrink-0 text-primary-600 transition-transform group-hover:scale-110 dark:text-primary-300"
          />
        </button>

        {activeAyah ? (
          <div
            role="status"
            aria-live="polite"
            className="mb-4 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100 sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="flex items-center gap-2 text-sm font-medium">
              <Info aria-hidden="true" className="h-4 w-4 shrink-0" />
              <span>
                {t("detail.listeningAyah", {
                  number: activeAyah.numberInSurah,
                })}
              </span>
            </span>
            <button
              type="button"
              onClick={handlePlayFullSurah}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-900 transition-colors hover:bg-amber-200 dark:bg-amber-900/70 dark:text-amber-100 dark:hover:bg-amber-800"
            >
              <ListMusic aria-hidden="true" className="h-4 w-4" />
              {t("detail.returnFull")}
            </button>
          </div>
        ) : null}

        <AudioPlayer
          ref={audioPlayerRef}
          src={activeAudioUrl}
          preload="none"
          className="rounded-xl"
          autoPlayAfterSrcChange
          showJumpControls={false}
          customAdditionalControls={EMPTY_CONTROLS}
        />
      </motion.section>

      <section
        className="space-y-6"
        aria-label={t("detail.ayahsLabel", { name: surah.localizedName })}
      >
        {surah.ayahs.map((ayah) => {
          const bookmarkId = getBookmarkId(
            number,
            ayah.numberInSurah,
            routeEditions
          );

          return (
            <AyahCard
              key={ayah.number}
              ayah={ayah}
              bookmarked={Boolean(bookmarkedIds[bookmarkId])}
              isActiveAudio={activeAyah?.number === ayah.number}
              onBookmark={handleBookmark}
              onCopy={handleCopyAyah}
              onPlay={handlePlayAyah}
            />
          );
        })}
      </section>

      <nav
        aria-label={t("detail.navigation")}
        className="flex items-center pt-8"
      >
        {Number(number) > 1 ? (
          <button
            type="button"
            onClick={() =>
              navigate(`/surah/${Number(number) - 1}/${routeEditionKey}`)
            }
            className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-3 text-white transition-colors hover:bg-primary-700 sm:px-6"
          >
            <ArrowLeft aria-hidden="true" className="h-5 w-5 rtl:rotate-180" />
            <span>{t("detail.previous")}</span>
          </button>
        ) : null}

        {Number(number) < 114 ? (
          <button
            type="button"
            onClick={() =>
              navigate(`/surah/${Number(number) + 1}/${routeEditionKey}`)
            }
            className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-emerald-600 px-4 py-3 font-semibold text-white shadow-2xl ring-1 ring-white/40 transition-all hover:-translate-y-0.5 hover:from-primary-700 hover:to-emerald-700 sm:px-6"
          >
            <span>{t("detail.next")}</span>
            <ArrowLeft aria-hidden="true" className="h-5 w-5 rotate-180 rtl:rotate-0" />
          </button>
        ) : null}
      </nav>
    </div>
  );
};

export default SurahDetail;
