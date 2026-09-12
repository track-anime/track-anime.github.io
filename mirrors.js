/**
 * Загрузка списка зеркал из /mirrors.json.
 * Порядок в массиве = порядок проверки.
 */
(function (global) {
  const FALLBACK_MIRRORS = [
    "https://track-anime.dygdyg.ru",
    "https://track-anime.duckdns.org",
    "https://ta.dygdyg.ru",
  ];

  function normalizeMirror(value) {
    if (typeof value !== "string") return null;
    const trimmed = value.trim().replace(/\/+$/, "");
    if (!/^https?:\/\//i.test(trimmed)) return null;
    return trimmed;
  }

  async function loadMirrors() {
    try {
      const url = new URL("/mirrors.json", window.location.origin);
      url.searchParams.set("_", String(Date.now()));
      const res = await fetch(url.href, { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data && data.mirrors)
          ? data.mirrors
          : [];
      const mirrors = list.map(normalizeMirror).filter(Boolean);
      if (mirrors.length > 0) return mirrors;
    } catch (error) {
      console.warn("[mirrors] failed to load mirrors.json, using fallback", error);
    }
    return FALLBACK_MIRRORS.slice();
  }

  global.TrackAnimeMirrors = {
    loadMirrors: loadMirrors,
    FALLBACK_MIRRORS: FALLBACK_MIRRORS.slice(),
  };
})(window);
