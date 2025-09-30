// Bookmark utilities
export const getBookmarks = () => {
  const bookmarks = localStorage.getItem("quran_bookmarks");
  return bookmarks ? JSON.parse(bookmarks) : [];
};

export const addBookmark = (surahNumber, ayahNumber, surahName) => {
  const bookmarks = getBookmarks();
  const newBookmark = {
    id: `${surahNumber}-${ayahNumber}`,
    surahNumber,
    ayahNumber,
    surahName,
    timestamp: new Date().toISOString(),
  };

  // Check if already bookmarked
  if (!bookmarks.some((b) => b.id === newBookmark.id)) {
    bookmarks.unshift(newBookmark);
    localStorage.setItem("quran_bookmarks", JSON.stringify(bookmarks));
  }

  return bookmarks;
};

export const removeBookmark = (id) => {
  const bookmarks = getBookmarks();
  const filtered = bookmarks.filter((b) => b.id !== id);
  localStorage.setItem("quran_bookmarks", JSON.stringify(filtered));
  return filtered;
};

export const isBookmarked = (surahNumber, ayahNumber) => {
  const bookmarks = getBookmarks();
  return bookmarks.some(
    (b) => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber
  );
};

// Last read utilities
export const saveLastRead = (surahNumber, edition) => {
  localStorage.setItem(
    "last_read",
    JSON.stringify({
      surahNumber,
      edition,
      timestamp: new Date().toISOString(),
    })
  );
};

export const getLastRead = () => {
  const lastRead = localStorage.getItem("last_read");
  return lastRead ? JSON.parse(lastRead) : null;
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy:", err);
    return false;
  }
};

// Format revelation type
export const formatRevelationType = (type) => {
  return type === "Meccan" ? "Mekki" : "Medeni";
};

// Class name utility
export const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};
