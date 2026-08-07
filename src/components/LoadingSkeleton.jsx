import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

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
  return "page";
};

const LoadingSkeleton = ({ variant = "auto" }) => {
  const { t } = useTranslation();
  const resolvedVariant = variant === "auto" ? getRouteVariant() : variant;

  if (resolvedVariant === "home") {
    return (
      <section
        role="status"
        aria-live="polite"
        aria-busy="true"
        className="space-y-16 md:space-y-20"
      >
        <span className="sr-only">{t("common.loading")}</span>

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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="glass space-y-4 rounded-2xl p-6">
              <SkeletonBlock className="h-8 w-8 rounded-lg" />
              <SkeletonBlock className="h-6 w-36 rounded-lg" />
              <SkeletonBlock className="h-16 w-full rounded-lg" />
            </div>
          ))}
        </div>

        <div className="glass grid grid-cols-1 gap-8 rounded-3xl p-8 md:grid-cols-3 md:p-12">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="space-y-3 text-center">
              <SkeletonBlock className="mx-auto h-12 w-28 rounded-xl" />
              <SkeletonBlock className="mx-auto h-5 w-24 rounded-lg" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="space-y-8 py-3"
    >
      <span className="sr-only">{t("common.loading")}</span>
      <div className="space-y-3">
        <SkeletonBlock className="h-10 w-52 rounded-xl" />
        <SkeletonBlock className="h-5 w-full max-w-2xl rounded-lg" />
      </div>

      {resolvedVariant === "surahs" ? (
        <>
          <SkeletonBlock className="h-44 w-full rounded-2xl" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }, (_, index) => (
              <SkeletonBlock key={index} className="h-36 rounded-xl" />
            ))}
          </div>
        </>
      ) : null}

      {resolvedVariant === "detail" ? (
        <>
          <SkeletonBlock className="h-36 w-full rounded-2xl" />
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="glass space-y-6 rounded-2xl p-6">
              <SkeletonBlock className="h-8 w-20 rounded-lg" />
              <SkeletonBlock className="ms-auto h-16 w-11/12 rounded-lg" />
              <div className="grid gap-4 md:grid-cols-2">
                <SkeletonBlock className="h-28 rounded-xl" />
                <SkeletonBlock className="h-28 rounded-xl" />
              </div>
            </div>
          ))}
        </>
      ) : null}

      {resolvedVariant === "page" ? (
        <div className="grid gap-5 md:grid-cols-2">
          <SkeletonBlock className="h-48 rounded-2xl" />
          <SkeletonBlock className="h-48 rounded-2xl" />
        </div>
      ) : null}
    </section>
  );
};

LoadingSkeleton.propTypes = {
  variant: PropTypes.oneOf(["auto", "home", "page", "surahs", "detail"]),
};

export default LoadingSkeleton;
