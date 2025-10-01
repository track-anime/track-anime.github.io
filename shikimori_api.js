var sh_api = {}

sh_api.url_get = new URL(window.location.href)
sh_api.UserData = {}
sh_api.Favorits = {}
sh_api.all_users = []
sh_api.another = { UserData: {}, Favorits: {}, status: "0" }
sh_api.authorize = false

// События (наружное API не меняем)
sh_api.authorize_ev = new Event("authorize", { bubbles: true })
sh_api.search_another = new Event("search_another", { bubbles: true })
sh_api.logout_ev = new Event("sh_api_logout", { bubbles: true })
sh_api.search_ev = new CustomEvent("sh_api_search", { bubbles: true })
sh_api.get_anime_ev = new CustomEvent("sh_get_anime", { bubbles: true })
sh_api.get_anime_ev_related = new CustomEvent("sh_get_anime_related", { bubbles: true })
sh_api.get_anime_ev_franchise = new CustomEvent("sh_get_anime_franchise", { bubbles: true })

sh_api.code = sh_api.url_get.searchParams.get('code')

// Статусы
sh_api.status_lable = ["watching","completed","dropped","on_hold","planned","rewatching"]
sh_api.status_color = {
  watching: ["#ffdd00", "смотрю"],
  completed: ["#3b8a3f", "просмотренно"],
  dropped: ["#9a3838", "брошено"],
  on_hold: ["#ab7a2f", "отложено"],
  planned: ["#ff00fb", "запланировано"],
  rewatching: ["#31d2f2", "пересматриваю"],
}
sh_api.status_lable_ru = ["смотрю","просмотренно","брошено","отложено","запланировано","пересматриваю"]

// Утилиты для кук
sh_api.getCookie = (name) => {
  var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

// OAuth: редирект на авторизацию
sh_api.get_key = () => {
  let qrcode = sh_api.url_get.searchParams.get('qrcode') ? "?qrcode=true" : ""
  location.href = `https://shikimori.one/oauth/authorize?client_id=aBohwwIpPXeCgSlo1xorfHKPaRBsdpW0_MMF8S-7SWA&redirect_uri=${window.location.origin}${window.location.pathname}${qrcode}&response_type=code`
}

// -------- AUTH --------
sh_api.add_token = () => {
  sh_api.url_get = new URL(window.location.href)
  if (sh_api.url_get.searchParams.get('qrcode')) return
  let code = sh_api.url_get.searchParams.get('code')
  if (!code && !sh_api.getCookie("sh_refresh_token")) return "no_key"

  fetch('https://shikimori.one/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=authorization_code&client_id=aBohwwIpPXeCgSlo1xorfHKPaRBsdpW0_MMF8S-7SWA&client_secret=4lyibuneC2Z34-EBoyX0tgs2ytagD4hda-SiFfpSUAo&code=${code}&redirect_uri=${window.location.origin}${window.location.pathname}`
  })
  .then(r => r.json())
  .then(data => {
    if (data.access_token) document.cookie = `sh_access_token=${data.access_token}; path=/; max-age=${data.expires_in};`
    if (data.refresh_token) document.cookie = `sh_refresh_token=${data.refresh_token}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT"`
    sh_api.url_get.searchParams.delete("code")
    window.history.pushState({}, '', sh_api.url_get);
    sh_api.authorize = true
    sh_api.get_user()
  })
  .catch(err => console.error("add_token error:", err))
}

sh_api.logout = () => {
  document.cookie = `sh_access_token=""; path=/; max-age=-1;`
  document.cookie = `sh_refresh_token=""; path=/; max-age=-1;`
  document.cookie = `_kawai_session=""; path=/; max-age=-1;`
  sh_api.authorize = false
  document.dispatchEvent(sh_api.logout_ev);
  setTimeout(() => location.reload(), 1000);
}

sh_api.refresh_token = async () => {
  const refresh = sh_api.getCookie("sh_refresh_token");
  if (!refresh) {
    sh_api.authorize = false;
    return "No_Authorize";
  }
  try {
    const res = await fetch('https://shikimori.one/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=refresh_token&client_id=aBohwwIpPXeCgSlo1xorfHKPaRBsdpW0_MMF8S-7SWA&client_secret=4lyibuneC2Z34-EBoyX0tgs2ytagD4hda-SiFfpSUAo&refresh_token=${refresh}`
    });
    const data = await res.json();
    if (data.access_token) {
      document.cookie = `sh_access_token=${data.access_token}; path=/; max-age=${data.expires_in};`
      if (data.refresh_token) document.cookie = `sh_refresh_token=${data.refresh_token}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT"`
      sh_api.authorize = true;
      return data.access_token;
    } else {
      console.error("refresh_token error:", data);
      sh_api.authorize = false;
      return "No_Authorize";
    }
  } catch (e) {
    console.error("refresh_token exception:", e);
    return "No_Authorize";
  }
}

// -------- Универсальный fetch с авторизацией и ретраями --------
async function fetchWithAuth(url, options={}, retries=0, expectJson=true) {
  if (!options.headers) options.headers = {};
  const token = sh_api.getCookie("sh_access_token");
  if (token) options.headers["Authorization"] = `Bearer ${token}`;

  try {
    const res = await fetch(url, options);

    if (res.ok) {
      if (!expectJson) return res; // например, 204/empty
      // иногда тело пустое — защитимся
      const text = await res.text();
      if (!text) return null;
      try { return JSON.parse(text); } catch { return text; }
    }

    if (res.status === 401 && retries < 1) {
      console.warn("401 Unauthorized, обновляем токен...");
      await sh_api.refresh_token();
      return fetchWithAuth(url, options, retries+1, expectJson);
    }

    if (res.status === 429 && retries < 3) {
      const wait = Math.pow(2, retries) * 1000; // 1s, 2s, 4s
      console.warn(`429 Too Many Requests, ждем ${wait}мс...`);
      await new Promise(r => setTimeout(r, wait));
      return fetchWithAuth(url, options, retries+1, expectJson);
    }

    if (res.status === 404) return "404";

    throw new Error(`HTTP ${res.status}`);
  } catch (e) {
    console.error("fetchWithAuth error:", e);
    throw e;
  }
}

// ======================
// API ФУНКЦИИ
// ======================

sh_api.get_user = async (user, isanother) => {
  let url = `https://shikimori.one/api/users/${user ? encodeURI(user) : "whoami"}`;
  let data = await fetchWithAuth(url);
  if (data === "404") {
    document.dispatchEvent(sh_api.search_another);
    return;
  }
  isanother ? sh_api.another.UserData = data : sh_api.UserData = data;
  if (!isanother) sh_api.authorize = true;
  sh_api.get_favorit((isanother ? data?.id : data?.id), isanother);
}

sh_api.get_favorit = async (uid, isanother) => {
  if (!uid) return;
  let url = `https://shikimori.one/api/users/${uid}/anime_rates?limit=5000`;
  let data = await fetchWithAuth(url);
  if (data === "404") return;

  if (isanother) {
    sh_api.another.Favorits.data = data;
    document.dispatchEvent(sh_api.search_another);
  } else {
    sh_api.Favorits.data = data;
    sh_api.Favorits.ids = Array.isArray(data) ? data.filter(e=>e.status=="watching").map(e=>e.anime.id) : [];
    document.dispatchEvent(sh_api.authorize_ev);
  }
}

sh_api.get_fav_color = (id) => {
  if (!sh_api?.Favorits?.data) return ["#ffffff","не добавлено"]
  const ent = sh_api.Favorits.data.find(e => e?.anime?.id == id);
  const st = ent?.status;
  return [st ? sh_api.status_color[st][0] : "#ffffff", st ? sh_api.status_color[st][1] : "не добавлено"]
}

sh_api.get_anime = async (id) => {
  let data = await fetchWithAuth(`https://shikimori.one/api/animes/${id}`);
  sh_api.get_anime_ev.anime = data;
  document.dispatchEvent(sh_api.get_anime_ev);
  sh_api.get_anime_related(id);
}

sh_api.get_anime_related = async (id) => {
  let data = await fetchWithAuth(`https://shikimori.one/api/animes/${id}/related`);
  sh_api.get_anime_ev.related = data;
  document.dispatchEvent(sh_api.get_anime_ev_related);
}

sh_api.get_anime_franchise = async (id) => {
  let data = await fetchWithAuth(`https://shikimori.one/api/animes/${id}/franchise`);
  sh_api.get_anime_ev.franchise = data;
  document.dispatchEvent(sh_api.get_anime_ev_franchise);
}

sh_api.search = async (query, censored=true) => {
  let url = `https://shikimori.one/api/animes?with_material_data=true&censored=${censored}&limit=50&search=${encodeURIComponent(query)}`
  let data = await fetchWithAuth(url);
  sh_api.search_ev.search = data;
  document.dispatchEvent(sh_api.search_ev);
}

// -------- UserRates (ВОЗВРАЩЕНО И УЛУЧШЕНО) --------

// Добавить/обновить статус тайтла у пользователя
// sl — индекс из sh_api.status_lable (0..5)
sh_api.AddUserRates = async (anime_id, sl) => {
  if (!sh_api.UserData?.id) {
    console.warn("AddUserRates: нет UserData, пробую получить...");
    await sh_api.get_user();
  }
  const status = sh_api.status_lable[sl ?? 0] || sh_api.status_lable[0];

  const body =
    `user_rate%5Buser_id%5D=${encodeURIComponent(sh_api.UserData.id)}&` +
    `user_rate%5Btarget_id%5D=${encodeURIComponent(anime_id)}&` +
    `user_rate%5Btarget_type%5D=Anime&` +
    `user_rate%5Bstatus%5D=${encodeURIComponent(status)}`;

  const res = await fetchWithAuth(
    `https://shikimori.one/api/user_rates`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body
    },
    0,
    true // ожидаем JSON
  );

  // Обновим список после изменения
  try {
    const favUserId = sh_api.url_get.searchParams.get('sh_user_fav') || sh_api.UserData?.id;
    if (favUserId) await sh_api.get_favorit(favUserId, false);
  } catch(e) { /* ignore */ }

  return res;
}

// Удалить запись из user_rates по её id
sh_api.DelUserRates = async (rate_id) => {
  const url = `https://shikimori.one/api/v2/user_rates/${rate_id}`;
  // На DELETE часто приходит пустой ответ/204 → expectJson=false
  await fetchWithAuth(url, { method: 'DELETE' }, 0, false);

  // Обновим список после удаления
  try {
    const favUserId = sh_api.url_get.searchParams.get('sh_user_fav') || sh_api.UserData?.id;
    if (favUserId) await sh_api.get_favorit(favUserId, false);
  } catch(e) { /* ignore */ }
}

// Стартовая обработка кода из OAuth
if (sh_api.code) sh_api.add_token()


/*     
https://shikimori.one/api/doc/1.0
https://shikimori.one/api/doc/2.0
https://shikimori.one/oauth/applications
*/
