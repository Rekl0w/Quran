import { Link } from "../lib/router";
import { Home, List } from "lucide-react";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <section className="glass mx-auto max-w-2xl rounded-3xl border border-gray-200 p-8 text-center dark:border-gray-700 md:p-12">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">
        404
      </p>
      <h1 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
        {t("notFound.title")}
      </h1>
      <p className="mt-4 text-gray-600 dark:text-gray-300">
        {t("notFound.description")}
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3 font-semibold text-white hover:bg-primary-700"
        >
          <Home aria-hidden="true" className="h-5 w-5" />
          {t("nav.home")}
        </Link>
        <Link
          to="/surahs"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800"
        >
          <List aria-hidden="true" className="h-5 w-5" />
          {t("nav.surahs")}
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
