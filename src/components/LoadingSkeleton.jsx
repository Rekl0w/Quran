import { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { getLastRead } from "../lib/utils";

const FEATURE_CARD_KEYS = [1, 2, 3, 4];
const STAT_KEYS = [1, 2, 3];
const SURAH_CARD_KEYS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const AYAH_CARD_KEYS = [1, 2, 3, 4];

const SkeletonBlock = ({ className }) => (
  <div aria-hidden="true" className={`skeleton ${className}`} />
);

SkeletonBlock.propTypes = {
  className: PropTypes.string.isRequired,
};

const getRouteVariant = () => {
  if (typeof window === "undefined") return "page";

  const pathname = window.location.pathname;
  if (pathname === "/") return "home";
  if (pathname === "/surahs") return "surahs";
  if (pathname.startsWith("/surah/")) return "detail";
  if (pathname === "/bookmarks") return "bookmarks";
  return "page";
};

const LoadingStatus = () => {
  const { t } = useTranslation();
  return <span className="sr-only">{t("common.loading")}</span>;
};

const HomeSkeleton = () => {
  const [hasLastRead] = useState(() => Boolean(getLastRead()));

  return (
    <div className="space-y-16 md:space-y-20">
      <div className="space-y-8 py-8 text-center md:py-12">
        <SkeletonBlock className="mx-auto h-16 w-64 max-w-full rounded-2xl md:h-20 md:w-96" />
        <div className="mx-auto space-y-3">
          <SkeletonBlock className="mx-auto h-6 w-full max-w-3xl rounded-lg" />
          <SkeletonBlock className="mx-auto h-6 w-4/5 max-w-2xl rounded-lg" />
        </div>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <SkeletonBlock className="h-14 w-48 rounded-xl" />
          <SkeletonBlock className="h-5 w-56 rounded-lg" />
        </div>
      </div>

      {hasLastRead ? (
        <div className="glass rounded-2xl border border-primary-200 p-6 dark:border-primary-900/60 md:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <SkeletonBlock className="h-12 w-12 shrink-0 rounded-xl" />
              <div className="space-y-2">
                <SkeletonBlock className="h-4 w-28 rounded-lg" />
                <SkeletonBlock className="h-8 w-48 rounded-lg" />
                <SkeletonBlock className="h-4 w-32 rounded-lg" />
              </div>
            </div>
            <SkeletonBlock className="h-12 w-full rounded-xl sm:w-52" />
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {FEATURE_CARD_KEYS.map((key) => (
          <div
            key={key}
            className="glass space-y-4 rounded-2xl border border-gray-200 p-6 dark:border-gray-700"
          >
            <SkeletonBlock className="h-8 w-8 rounded-lg" />
            <SkeletonBlock className="h-6 w-36 rounded-lg" />
            <div className="space-y-2">
              <SkeletonBlock className="h-4 w-full rounded-lg" />
              <SkeletonBlock className="h-4 w-4/5 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      <div className="glass grid grid-cols-1 gap-8 rounded-3xl p-8 md:grid-cols-3 md:p-12">
        {STAT_KEYS.map((key) => (
          <div key={key} className="space-y-3 text-center">
            <SkeletonBlock className="mx-auto h-12 w-28 rounded-xl" />
            <SkeletonBlock className="mx-auto h-5 w-24 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
};

const EditionPickerSkeleton = ({ compact = false }) => (
  <div className={compact ? "max-w-3xl space-y-3" : "space-y-3"}>
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2">
        <SkeletonBlock className="h-5 w-48 rounded-lg" />
        <SkeletonBlock className="h-4 w-72 max-w-full rounded-lg" />
      </div>
      <SkeletonBlock className="h-9 w-40 rounded-lg" />
    </div>
    <SkeletonBlock className="h-8 w-40 rounded-full" />
    <SkeletonBlock className="h-12 w-full rounded-xl" />
  </div>
);

EditionPickerSkeleton.propTypes = {
  compact: PropTypes.bool,
};

const SurahCardSkeleton = ({ cardKey }) => (
  <div
    key={cardKey}
    className="glass rounded-xl border border-gray-200 p-6 dark:border-gray-700"
  >
    <div className="mb-4 flex items-start justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <SkeletonBlock className="h-10 w-10 shrink-0 rounded-lg" />
        <SkeletonBlock className="h-6 w-32 rounded-lg" />
      </div>
      <SkeletonBlock className="h-8 w-16 shrink-0 rounded-lg" />
    </div>
    <div className="flex items-center justify-between">
      <SkeletonBlock className="h-5 w-20 rounded-lg" />
      <SkeletonBlock className="h-5 w-20 rounded-lg" />
    </div>
  </div>
);

SurahCardSkeleton.propTypes = {
  cardKey: PropTypes.number.isRequired,
};

const SurahsSkeleton = () => (
  <div className="space-y-8">
    <div className="space-y-4">
      <SkeletonBlock className="h-12 w-52 rounded-xl md:h-14" />
      <SkeletonBlock className="h-6 w-full max-w-4xl rounded-lg" />
    </div>

    <div className="glass space-y-5 rounded-2xl p-6">
      <div className="space-y-2">
        <SkeletonBlock className="h-5 w-24 rounded-lg" />
        <SkeletonBlock className="h-12 w-full rounded-xl" />
      </div>
      <EditionPickerSkeleton />
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {SURAH_CARD_KEYS.map((key) => (
        <SurahCardSkeleton key={key} cardKey={key} />
      ))}
    </div>
  </div>
);

const AyahCardSkeleton = ({ cardKey }) => (
  <div
    key={cardKey}
    className="glass space-y-6 rounded-2xl border border-gray-200 p-5 dark:border-gray-700 md:p-6"
  >
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <SkeletonBlock className="h-10 w-10 rounded-lg" />
        <SkeletonBlock className="h-6 w-20 rounded-lg" />
      </div>
      <div className="flex gap-2">
        <SkeletonBlock className="h-10 w-10 rounded-lg" />
        <SkeletonBlock className="h-10 w-10 rounded-lg" />
      </div>
    </div>
    <div className="space-y-3">
      <SkeletonBlock className="ms-auto h-8 w-11/12 rounded-lg" />
      <SkeletonBlock className="ms-auto h-8 w-3/4 rounded-lg" />
    </div>
    <div className="space-y-3 rounded-xl bg-white/60 p-4 dark:bg-gray-900/30">
      <SkeletonBlock className="h-4 w-36 rounded-lg" />
      <SkeletonBlock className="h-5 w-full rounded-lg" />
      <SkeletonBlock className="h-5 w-4/5 rounded-lg" />
    </div>
  </div>
);

AyahCardSkeleton.propTypes = {
  cardKey: PropTypes.number.isRequired,
};

const DetailSkeleton = () => (
  <div className="space-y-8 pb-24">
    <div className="space-y-5">
      <SkeletonBlock className="h-6 w-32 rounded-lg" />
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <SkeletonBlock className="h-12 w-72 max-w-full rounded-xl md:h-14" />
          <SkeletonBlock className="h-5 w-40 rounded-lg" />
          <SkeletonBlock className="h-5 w-72 max-w-full rounded-lg" />
        </div>
        <div className="space-y-3 md:flex md:flex-col md:items-end">
          <SkeletonBlock className="h-10 w-28 rounded-lg" />
          <SkeletonBlock className="h-10 w-24 rounded-lg" />
        </div>
      </div>
      <EditionPickerSkeleton compact />
    </div>

    <div className="glass space-y-4 rounded-2xl p-5 md:p-6">
      <SkeletonBlock className="h-[74px] w-full rounded-2xl" />
      <SkeletonBlock className="h-24 w-full rounded-xl" />
    </div>

    <div className="space-y-6">
      {AYAH_CARD_KEYS.map((key) => (
        <AyahCardSkeleton key={key} cardKey={key} />
      ))}
    </div>
  </div>
);

const BookmarksSkeleton = () => (
  <div className="space-y-8">
    <div className="flex items-start gap-4">
      <SkeletonBlock className="h-12 w-12 shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1 space-y-3">
        <SkeletonBlock className="h-12 w-64 max-w-full rounded-xl md:h-14" />
        <SkeletonBlock className="h-6 w-full max-w-3xl rounded-lg" />
      </div>
    </div>
    <div className="glass space-y-4 rounded-2xl border border-gray-200 p-12 text-center dark:border-gray-700">
      <SkeletonBlock className="mx-auto h-16 w-16 rounded-xl" />
      <SkeletonBlock className="mx-auto h-7 w-52 rounded-lg" />
      <SkeletonBlock className="mx-auto h-5 w-full max-w-xl rounded-lg" />
      <SkeletonBlock className="mx-auto h-12 w-40 rounded-xl" />
    </div>
  </div>
);

const PageSkeleton = () => (
  <div className="glass mx-auto max-w-2xl space-y-4 rounded-3xl border border-gray-200 p-8 text-center dark:border-gray-700 md:p-12">
    <SkeletonBlock className="mx-auto h-4 w-12 rounded-lg" />
    <SkeletonBlock className="mx-auto h-10 w-72 max-w-full rounded-xl" />
    <SkeletonBlock className="mx-auto h-5 w-full max-w-lg rounded-lg" />
    <div className="flex flex-col justify-center gap-3 pt-4 sm:flex-row">
      <SkeletonBlock className="h-12 w-full rounded-xl sm:w-36" />
      <SkeletonBlock className="h-12 w-full rounded-xl sm:w-36" />
    </div>
  </div>
);

const LoadingSkeleton = ({ variant = "auto" }) => {
  const resolvedVariant = variant === "auto" ? getRouteVariant() : variant;
  const variants = {
    bookmarks: <BookmarksSkeleton />,
    detail: <DetailSkeleton />,
    home: <HomeSkeleton />,
    page: <PageSkeleton />,
    surahs: <SurahsSkeleton />,
  };

  return (
    <section role="status" aria-live="polite" aria-busy="true">
      <LoadingStatus />
      {variants[resolvedVariant]}
    </section>
  );
};

LoadingSkeleton.propTypes = {
  variant: PropTypes.oneOf([
    "auto",
    "bookmarks",
    "detail",
    "home",
    "page",
    "surahs",
  ]),
};

export default LoadingSkeleton;
