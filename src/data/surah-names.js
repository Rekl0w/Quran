const nameLoaders = import.meta.glob("../locales/*/surah-names.js");
const nameCache = new Map();
const nameRequests = new Map();

const isValidCatalog = (catalog) =>
  Array.isArray(catalog) &&
  catalog.length === 114 &&
  catalog.every((name) => typeof name === "string" && name.trim().length > 0);

export const getLocalizedSurahNames = async (language) => {
  if (nameCache.has(language)) return nameCache.get(language);
  if (nameRequests.has(language)) return nameRequests.get(language);

  const loader = nameLoaders[`../locales/${language}/surah-names.js`];
  if (!loader) throw new Error(`Missing surah name catalog: ${language}`);

  const request = loader()
    .then((module) => {
      if (!isValidCatalog(module.default)) {
        throw new Error(`Invalid surah name catalog: ${language}`);
      }

      nameCache.set(language, module.default);
      return module.default;
    })
    .finally(() => {
      nameRequests.delete(language);
    });

  nameRequests.set(language, request);
  return request;
};
