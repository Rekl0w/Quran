import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const SkeletonBlock = ({ className }) => (
  <div aria-hidden="true" className={`skeleton ${className}`} />
);

SkeletonBlock.propTypes = {
  className: PropTypes.string.isRequired,
};

const LoadingSkeleton = ({ variant = "page" }) => {
  const { t } = useTranslation();

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

      {variant === "surahs" ? (
        <>
          <SkeletonBlock className="h-44 w-full rounded-2xl" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }, (_, index) => (
              <SkeletonBlock key={index} className="h-36 rounded-xl" />
            ))}
          </div>
        </>
      ) : null}

      {variant === "detail" ? (
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

      {variant === "page" ? (
        <div className="grid gap-5 md:grid-cols-2">
          <SkeletonBlock className="h-48 rounded-2xl" />
          <SkeletonBlock className="h-48 rounded-2xl" />
        </div>
      ) : null}
    </section>
  );
};

LoadingSkeleton.propTypes = {
  variant: PropTypes.oneOf(["page", "surahs", "detail"]),
};

export default LoadingSkeleton;
