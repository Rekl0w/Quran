import { memo } from "react";
import PropTypes from "prop-types";
import {
  Bookmark,
  BookmarkCheck,
  CirclePlay,
  Copy,
  Volume2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const AyahCard = ({
  ayah,
  bookmarked,
  isActiveAudio,
  onBookmark,
  onCopy,
  onPlay,
}) => {
  const { t } = useTranslation();

  return (
    <article
      id={`ayah-${ayah.numberInSurah}`}
      aria-labelledby={`ayah-title-${ayah.numberInSurah}`}
      className="ayah-card glass scroll-mt-24 space-y-5 rounded-2xl border border-gray-200 p-5 dark:border-gray-700 md:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-emerald-600 text-sm font-bold text-white">
            {ayah.numberInSurah}
          </div>
          <h2
            id={`ayah-title-${ayah.numberInSurah}`}
            className="text-sm font-medium text-gray-600 dark:text-gray-300"
          >
            {t("common.ayah")} {ayah.numberInSurah}
          </h2>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onPlay(ayah)}
            aria-label={t("detail.playAyah", { number: ayah.numberInSurah })}
            aria-pressed={isActiveAudio}
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
              isActiveAudio
                ? "border-primary-500 bg-primary-600 text-white"
                : "border-primary-200 bg-primary-50 text-primary-700 hover:bg-primary-100 dark:border-primary-800 dark:bg-primary-950/50 dark:text-primary-200 dark:hover:bg-primary-900/60"
            }`}
          >
            {isActiveAudio ? (
              <Volume2 aria-hidden="true" className="h-5 w-5" />
            ) : (
              <CirclePlay aria-hidden="true" className="h-5 w-5" />
            )}
            <span>{t("detail.playAyah", { number: ayah.numberInSurah })}</span>
          </button>
          <button
            type="button"
            onClick={() => onBookmark(ayah)}
            aria-label={t(
              bookmarked ? "detail.removeBookmark" : "detail.addBookmark",
              { number: ayah.numberInSurah }
            )}
            aria-pressed={bookmarked}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {bookmarked ? (
              <BookmarkCheck className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            ) : (
              <Bookmark className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>

      <p
        lang="ar"
        dir="rtl"
        className="arabic-text text-3xl text-gray-900 dark:text-white md:text-4xl"
      >
        {ayah.arabicText}
      </p>

      <div className={`grid gap-4 ${ayah.translations.length > 1 ? "md:grid-cols-2" : ""}`}>
        {ayah.translations.map((translation) => (
          <section
            key={translation.edition.identifier}
            className="rounded-xl border border-gray-200 bg-white/60 p-4 dark:border-gray-700 dark:bg-gray-900/40"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-300">
                {translation.edition.name}
              </p>
              <button
                type="button"
                onClick={() =>
                  onCopy(
                    translation.text,
                    ayah.numberInSurah,
                    translation.edition.name
                  )
                }
                aria-label={t("detail.copyTranslation", {
                  number: ayah.numberInSurah,
                  name: translation.edition.name,
                })}
                className="shrink-0 rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-primary-700 dark:hover:bg-gray-800"
              >
                <Copy aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
            <p
              lang={translation.edition.language}
              dir={translation.edition.direction || "ltr"}
              className="text-base leading-relaxed text-gray-700 dark:text-gray-100 md:text-lg"
            >
              {translation.text}
            </p>
          </section>
        ))}
      </div>
    </article>
  );
};

const editionShape = PropTypes.shape({
  identifier: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  direction: PropTypes.string,
});

AyahCard.propTypes = {
  ayah: PropTypes.shape({
    number: PropTypes.number.isRequired,
    numberInSurah: PropTypes.number.isRequired,
    arabicText: PropTypes.string.isRequired,
    translations: PropTypes.arrayOf(
      PropTypes.shape({
        edition: editionShape.isRequired,
        text: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  bookmarked: PropTypes.bool.isRequired,
  isActiveAudio: PropTypes.bool.isRequired,
  onBookmark: PropTypes.func.isRequired,
  onCopy: PropTypes.func.isRequired,
  onPlay: PropTypes.func.isRequired,
};

export default memo(AyahCard);
