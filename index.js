var data, dat, targetFrame, endid, endid2, prev_page, SH_UserData, SH_Favorite, cart_data, backgrounds
var ld = false, SH_isAvtorize = false;
var AnimeScanID = {}
const scrollM = 2000;
var ignoreVoice = false
window.moment.locale('ru')
var HistoryIsActivy = true
var TypePage = 0
document.body.r = 2
var FavCheckSave = false
var url_get = new URL(window.location.href)
const KeyTab = Math.floor(Math.random() * 10000000000)
const VideoPlayerAnime = document.getElementById('VideoPlayerAnime');
VideoPlayerAnime.modal = new bootstrap.Modal(VideoPlayerAnime);
const VideoInfo = document.getElementById('VideoInfo');
const VoiceSettings = document.getElementById('VoiceSettings_content');
VoiceSettings.modal = new bootstrap.Modal(document.getElementById('VoiceSettings'));
const VideoPlayer = document.getElementById('VideoPlayer');
const list_calendar = document.getElementById("list_calendar");
const container_ = document.body.querySelector('.container_');
const load = document.getElementById("load");
const list_fav = document.getElementById("list_fav");
const list_serch = document.getElementById("list_serch");
const list_history = document.getElementById("list_history");
const styleDateCart = document.createElement("style")
const ChecDataCart = document.getElementById("ChecDataCart")



const nav_panel_buttons = document.querySelector('nav.navbar.navbar-expand-lg.bg-body-tertiary.sticky-top')



const URLSearch = "https://kodikapi.com/search?token=45c53578f11ecfb74e31267b634cc6a8&with_material_data=true&title="
var URLList = "https://kodikapi.com/list?limit=100&with_material_data=true&camrip=false&token=45c53578f11ecfb74e31267b634cc6a8"//&countries=Япония"
var URLCalendar = "https://kodikapi.com/list?limit=100&with_material_data=true&camrip=false&token=45c53578f11ecfb74e31267b634cc6a8&anime_status=ongoing"//&anime_kind=tv"//&countries=Япония"
var URLListStart = "https://kodikapi.com/list?limit=100&with_material_data=true&camrip=false&token=45c53578f11ecfb74e31267b634cc6a8"


///////////////////////////////////// Загружаются настройки из локалстораджа ///////////////////////////////
var base_anime = localStorage.getItem('BaseAnime')
if (base_anime) {
    base_anime = JSON.parse(base_anime)
} else {
    base_anime = {}
}
if (base_anime.base) {
    delete base_anime.base;
    localStorage.setItem('BaseAnime', JSON.stringify(base_anime));
}
base_anime.fav = base_anime.fav ? base_anime.fav : []
base_anime.authorize = base_anime.authorize ? base_anime.authorize : false
///////////////////////////////////////////////////////////////////////////////////////////////////////////


// window?.Notification?.requestPermission()
sh_api.get_user()
// sh_api.get_key()
if (!sh_api.getCookie("sh_refresh_token") && base_anime.authorize == true && !sh_api.getCookie("sh_refresh_token") && !sh_api.url_get.searchParams.get('code')) sh_api.get_key()
setTimeout(() => {
}, 1500);


const voice = [
    "AniStar",
    "Dream Cast",
    "AnimeVost",
    "AniDub Online",
    "AniDUB",
    "JAM",
    "AniLibria.TV",
    "SHIZA Project",
]

VideoInfo.info = {
    "cover": VideoInfo.querySelector("#info_cover"),
    "title": VideoInfo.querySelector("#info_title"),
    "title2": VideoInfo.querySelector("#info_title2"),
    "description": VideoInfo.querySelector("#info_description"),

    "countries": VideoInfo.querySelector("#info_countries"),
    "genres": VideoInfo.querySelector("#info_genres"),
    "series": VideoInfo.querySelector("#info_series"),
    "studios": VideoInfo.querySelector("#info_studios"),
    "updated_at": VideoInfo.querySelector("#info_updated_at"),
    "screenshots": VideoInfo.querySelector("#info_screenshots"),
    "videos": VideoInfo.querySelector("#info_videos"),
    "info_status": VideoInfo.querySelector("#info_status"),
    "year": VideoInfo.querySelector("#info_year"),
    "rating_mpaa": VideoInfo.querySelector("#info_rating_mpaa"),
    "shikimori_rating": VideoInfo.querySelector("#info_shikimori_rating"),
    "shikimori_votes": VideoInfo.querySelector("#info_shikimori_votes"),
    "imdb_rating": VideoInfo.querySelector("#info_imdb_rating"),
    "imdb_votes": VideoInfo.querySelector("#info_imdb_votes"),
    "updated_at": VideoInfo.querySelector("#info_updated_at"),
    "updated_at_text": VideoInfo.querySelector("#info_updated_at_text"),
    "shikimori_link": VideoInfo.querySelector("#info_shikimori_link"),
    "IMDB_link": VideoInfo.querySelector("#info_IMDB_link"),
    "AlohaPlayer": VideoInfo.querySelector("#info_AlohaPlayer"),
    "TorrentPlayer": VideoInfo.querySelector("#info_TorrentPlayer"),
    "KodikPlayer": VideoInfo.querySelector("#info_KodikPlayer"),
    "duration": VideoInfo.querySelector("#info_duration"),
    "TorrentURL": null,


}

// list_serch.children[4].scrollIntoView({behavior: "smooth"}) чтоб перейти к нужному объекту на странице

document.addEventListener('DOMContentLoaded', function () {

    //////////////////////////////////////////////////////////// Проверка серий /////////////////////////////////////////////////////////
    setInterval(() => {
        if (!HistoryIsActivy || ld) return
        GetKodi("", true)
    }, 30 * 1000);  //Автопроверка 
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

});

///////////////////////////////////////// Проверка гет фильтров поиска ///////////////////////////////////////////////////////////
URLList = url_get.searchParams.get('anime_genres') ? `${URLList}&anime_genres=${encodeURIComponent(url_get.searchParams.get('anime_genres'))}` : URLList
URLList = url_get.searchParams.get('rating_mpaa') ? `${URLList}&rating_mpaa=${encodeURIComponent(url_get.searchParams.get('rating_mpaa'))}` : URLList
URLList = url_get.searchParams.get('year') ? `${URLList}&year=${encodeURIComponent(url_get.searchParams.get('year'))}` : URLList
URLList = url_get.searchParams.get('countries') ? `${URLList}&countries=${encodeURIComponent(url_get.searchParams.get('countries'))}` : URLList
URLList = url_get.searchParams.get('anime_studios') ? `${URLList}&anime_studios=${encodeURIComponent(url_get.searchParams.get('anime_studios'))}` : URLList
URLList = url_get.searchParams.get('anime_status') ? `${URLList}&anime_status=${encodeURIComponent(url_get.searchParams.get('anime_status'))}` : URLList
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

URLListStart = URLList  // Обновляем ссылку после пррименения гет запросов



load.show = (bool) => bool ? load.classList.remove("hide") : load.classList.add("hide")

ChecDataCart.addEventListener('change', function () {
    hide_date_cart(this.checked)
})

hide_date_cart()

function hide_date_cart(tr) {
    document.head.appendChild(styleDateCart)
    if (typeof tr != "boolean") {
        ChecDataCart.checked = base_anime.hide_date_cart
        tr = base_anime.hide_date_cart
    }
    // console.log(121, tr)

    // ChecDataCart.checked = tr

    if (tr == true) {
        styleDateCart.textContent = `
        .cart_n_bg{
            display: none !important;
        }
        `
    } else {
        styleDateCart.textContent = `
        `
    }
    base_anime.hide_date_cart = tr
    localStorage.setItem('BaseAnime', JSON.stringify(base_anime));
}

function TorrentURL() {
    window.open(`https://darklibria.it/search?find=${VideoInfo.info.TorrentPlayer.title}`)
};

document.querySelector("#pipDialogButton").addEventListener('click', () => {
    ta_pip()
})




function setVideoInfo(e) {
    // console.log(e)
    load.show(false)
    var html

    VideoInfo.e = e
    const tv = e.kind ? ` [${e.kind.toUpperCase()}]` : ""
    VideoInfo.info.cover.src = `https://shikimori.one${e.image.original}`;
    VideoInfo.info.title.childNodes[0].nodeValue = e.russian ? `${tv}` : "?";
    VideoInfo.info.title.querySelector("a").textContent = e.russian ? `${e.russian}` : "?";
    VideoInfo.info.title.querySelector("a").href = e.russian ? `${window.location.origin + window.location.pathname}?seartch=${e.russian ? encodeURIComponent(e.russian) : "404.html"}` : "404.html";
    // VideoInfo.info.title2.textContent = e.material_data.anime_title ? `${tv} ${e.material_data.anime_title}` : "?";

    // VideoInfo.info.countries.textContent = e.countries ? e.countries : "?";
    // VideoInfo.info.countries.href = e.countries ? `${window.location.origin + window.location.pathname}?countries=${e.material_data.countries ? e.material_data.countries : "404.html"}` : "404.html";

    var tmp346 = e.episodes_aired ? e.episodes_aired : "?";
    tmp346 = tmp346 + `/${e.episodes ? e.episodes : "?"}`;

    VideoInfo.info.series.textContent = tmp346;
    VideoInfo.info.duration.textContent = `${window.counterToStringLabel(e?.duration)}`;
    VideoInfo.info.duration.min = VideoInfo?.e?.duration
    // VideoInfo.info.countries.href = `${window.location.origin + window.location.pathname}?countries=${e.countries ? e.countries : "404.html"}`;

    VideoInfo.info.description.innerHTML = e.description_html ? e.description_html : "?";

    VideoInfo.info.info_status.textContent = e.status ? e.status : "?";
    VideoInfo.info.info_status.href = e.status ? `${window.location.origin + window.location.pathname}?anime_status=${e.anime_status ? e.anime_status : "404.html"}` : "404.html";

    VideoInfo.info.studios.textContent = e.studios[0]?.filtered_name ? e.studios[0].filtered_name : "?";
    VideoInfo.info.studios.href = e.studios[0]?.filtered_name ? `${window.location.origin + window.location.pathname}?anime_studios=${e.studios[0].filtered_name ? e.studios[0].filtered_name : "404.html"}` : "404.html";

    VideoInfo.info.year.textContent = e.aired_on ? e.aired_on.split("-")[0] : "?";
    VideoInfo.info.year.href = e.year ? `${window.location.origin + window.location.pathname}?year=${e.year ? e.year : "404.html"}` : "404.html";

    VideoInfo.info.rating_mpaa.textContent = e.rating ? e.rating : "?";
    VideoInfo.info.rating_mpaa.href = e.rating ? `${window.location.origin + window.location.pathname}?rating_mpaa=${e.rating ? e.rating : "404.html"}` : "404.html";

    const dat = e.released_on ? e.released_on : e.aired_on

    if (e.status == "ongoing" && formatDate(dat).moment.diff(moment.now(), "minute") > 0) {

        // VideoInfo.info.updated_at_text.textContent = e.anime_status == "ongoing" ? "Следующая серия выйдет " : "Последняя серия вышла ";
        VideoInfo.info.updated_at.textContent = `Следующая серия выйдет ${formatDate(e.next_episode_at).moment.fromNow().toLowerCase()}. ${formatDate(e.next_episode_at).moment.calendar()}`
    } else {
        VideoInfo.info.updated_at.textContent = `Вышла ${formatDate(dat).moment.fromNow().toLowerCase()}. ${formatDate(dat).moment.calendar()}`
    }

    // VideoInfo.info.title.innerHTML = `${VideoInfo.info.title.textContent}`
    VideoInfo.info.title2.innerHTML = `[${VideoInfo.info.updated_at.textContent}]`

    VideoInfo.info.shikimori_rating.style.width = e.score ? `${e.score * 10}%` : "0%";
    VideoInfo.info.shikimori_rating.textContent = e.score ? `${e.score}/10` : "?";
    var rates_scores_stats = 0
    e.rates_scores_stats.forEach(e => {
        rates_scores_stats = rates_scores_stats + e.value
    });
    VideoInfo.info.shikimori_votes.textContent = rates_scores_stats ? `${rates_scores_stats} проголосовавших` : "?";
    VideoInfo.info.shikimori_link.href = e.id ? `https://shikimori.one/animes/${e.id ? e.id : "404.html"}` : "404.html";

    VideoInfo.info.imdb_rating.style.width = e.imdb_rating ? `${e.imdb_rating * 10}%` : "0%";
    VideoInfo.info.imdb_rating.textContent = e.imdb_rating ? `${e.imdb_rating}/10` : "?";
    VideoInfo.info.imdb_votes.textContent = e.imdb_votes ? `${e.imdb_votes} проголосовавших` : "?";
    VideoInfo.info.IMDB_link.href = e.imdb ? `https://www.imdb.com/title/${e.imdb ? e.imdb : "404.html"}` : "404.html";

    e.imdb ? document.getElementById("imdb_info").classList.remove('hide') : document.getElementById("imdb_info").classList.add('hide')
    // e.imdb||e.kp ? VideoInfo.info.AlohaPlayer.classList.remove('hide') : VideoInfo.info.AlohaPlayer.classList.add('hide')
    VideoInfo.info.AlohaPlayer.textContent = e.imdb ? "Смотреть Alloha Player" : "Alloha!! Мне повезёт!!"
    VideoInfo.info.AlohaPlayer.title = "Зажать shift для поиска по названию"
    VideoInfo.info.AlohaPlayer.addEventListener('click', (ev) => {

        let DialogVideoInfo = document.getElementById('DialogVideoInfo');
        DialogVideoInfo.classList.remove("DialogVideoInfoScroll");
        VideoPlayer.contentWindow.location.href = `https://dygdyg.github.io/DygDygWEB/svetacdn.htm?menu_default=menu_button&shikimori=${e.id}&query=${e.russian.replace(/ /g, '+')}`
        if (ev.shiftKey) {
            VideoPlayer.contentWindow.location.href = `https://dygdyg.github.io/DygDygWEB/svetacdn.htm?menu_default=menu_button&shikimori=${e.id}&query=${e.english[0].replace(/ /g, '+')}`
        }
    })



    VideoInfo.info.TorrentPlayer.title = e.russian
    VideoInfo.info.TorrentPlayer.removeEventListener('click', TorrentURL, false)
    VideoInfo.info.TorrentPlayer.addEventListener('click', TorrentURL, false)
    // VideoInfo.info.TorrentPlayer.en = true;



    VideoInfo.info.KodikPlayer.addEventListener('click', () => {
        let DialogVideoInfo = document.getElementById('DialogVideoInfo');
        DialogVideoInfo.classList.remove("DialogVideoInfoScroll");

        // VideoPlayer.contentWindow.location.href = e.link;
        VideoPlayer.contentWindow.location.href = `https://kodik.cc/find-player?shikimoriID=${e.id}`;
        // VideoPlayer.contentWindow.location.href = `https://dygdyg.github.io/DygDygWEB/svetacdn.htm?loadserv=kinobox&imdb=${e.imdb}`
    })
    html = ""
    html2 = ""
    e.screenshots?.forEach(el => {
        html = html + `
        <div class="carousel-item w-100">
        <img src="https://shikimori.one${el.original}"
            class="d-block w-100"  alt="...">
    </div>
    ` });
    e.videos?.forEach(el => {
        // return
        html2 = html2 + `
        <div class="carousel-item">
            <iframe src="${location.protocol + el.player_url.replace("https:", "").replace("http:", "")}"
                class="d-block w-100" style="aspect-ratio: 16 / 9" alt="...">
            </iframe>
            <div class="carousel-caption vi_label">
                        <p>${el.name} / ${el.hosting}</p>
                    </div>
        </div>
    ` });
    //channelId=UCOz4k6q0mDc8fReKXyC-KOQ&
    fetch(`//youtube.googleapis.com/youtube/v3/search?part=snippet&relevanceLanguage=ru&q=${e.russian}${encodeURIComponent(" трейлер русская озвучка")}&key=AIzaSyAQS-Vh1GcuAYoKYy-1wOt0CSwTDEB39wQ`, {
        headers: {
            'Referer': location.href
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log("yt: ", data)
            // console.log(VideoInfo.info.videos.innerHTML, html2)
            html2 = VideoInfo.info.videos.innerHTML
            var a1 = ""
            if (!data?.items?.[0]?.id?.videoId) return
            data.items?.forEach((el, it) => {

                // console.log(it)
                // console.log(el)
                a1 = a1 + `
                    <div class="carousel-item" data-interval="false">
                        <iframe src="//youtube.com/embed/${el.id?.videoId}"
                            class="d-block w-100" style="aspect-ratio: 16 / 9" alt="...">
                        </iframe>
                        <div class="carousel-caption vi_label">
                                    <p>[${it + 1} / ${data.items?.length}] ${el.snippet.title}</p>
                                </div>
                    </div>
                    `;

            })

            VideoInfo.info.videos.innerHTML = a1 + html2;
            VideoInfo.info.videos.querySelectorAll(".carousel-item")[0]?.classList.add("active");
            // console.log(VideoInfo.info.videos.innerHTML, html2)
        })
        .catch(error => console.error(1, 'Error:', error));


    e.screenshots || e.screenshots ? VideoInfo.info.screenshots.parentNode.classList.remove("hide") : VideoInfo.info.screenshots.parentNode.classList.add("hide")
    e.videos || e.videos ? VideoInfo.info.videos.parentNode.classList.remove("hide") : VideoInfo.info.videos.parentNode.classList.add("hide")
    VideoInfo.info.screenshots.innerHTML = html;
    VideoInfo.info.videos.innerHTML = html2;
    VideoInfo.info.screenshots.querySelectorAll(".carousel-item")[0]?.classList.add("active");
    VideoInfo.info.videos.querySelectorAll(".carousel-item")[0]?.classList.add("active");

    html = "Жанры: "
    e.genres?.forEach(el => {
        html = html + `
        <a href="${window.location.origin + window.location.pathname}?anime_genres=${el.russian}"class="info_genre link-danger link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">${el.russian}</a>
        `
    })
    VideoInfo.info.genres.innerHTML = html;

    var btn_sh_save = document.getElementById('btn_sh_save')
    btn_sh_save.ids = e.id ? e.id : null;
    if (sh_api.authorize) {
        sh_api.get_favorit(url_get.searchParams.get('sh_user_fav'))
    } else {
        btn_sh_save.classList.add("hide")
        return
    }
    console.log(123, e.id)
    btn_sh_save.sh_fv = sh_api?.Favorits?.data?.find(item => item.anime.id == e.id)

    btn_sh_save.classList.remove("hide")
    btn_sh_save.classList.remove("btn-outline-light")
    btn_sh_save.classList.remove("btn-primary")
    btn_sh_save.classList.remove("yellow")
    btn_sh_save.classList.remove("yellow_bg")
    btn_sh_save.classList.remove("btn-success")
    btn_sh_save.classList.remove("btn-danger")
    btn_sh_save.classList.remove("btn-warning")
    btn_sh_save.classList.remove("pink")
    btn_sh_save.classList.remove("pink-bg")
    btn_sh_save.classList.remove("btn-info")

    switch (btn_sh_save?.sh_fv?.status) {
        case "watching":
            btn_sh_save.textContent = "смотрю"
            btn_sh_save.classList.add("yellow")
            btn_sh_save.classList.add("yellow_bg")
            btn_sh_save.classList.add("btn-primary")
            break;
        case "completed":
            btn_sh_save.textContent = "просмотренно"
            btn_sh_save.classList.add("btn-success")

            break;
        case "dropped":
            btn_sh_save.textContent = "брошено"
            btn_sh_save.classList.add("btn-danger")
            break;
        case "on_hold":
            btn_sh_save.textContent = "отложено"
            btn_sh_save.classList.add("btn-warning")
            break;
        case "planned":
            btn_sh_save.textContent = "запланировано"
            // btn_sh_save.classList.add("btn-secondary")
            btn_sh_save.classList.add("pink")
            btn_sh_save.classList.add("pink_bg")
            break;
        case "rewatching":
            btn_sh_save.textContent = "пересматриваю"
            btn_sh_save.classList.add("btn-info")
            break;
        default:
            btn_sh_save.textContent = "Добавить"
            btn_sh_save.classList.add("btn-outline-light")
            break;
    }

}


document.getElementById('User_Fav_sinc_button').addEventListener('mousedown', (e) => {

    switch (e.button) {
        case 0:
            GetFavBtn(sh_api.UserData.id)
            break;
        case 1:
            tmp = url_get
            tmp.searchParams.set("sh_user_fav", `${sh_api.UserData.id}`)
            window.open(tmp.href, "_blank");
            break;
        case 2:
            break;

        default:
            break;
    }
})
function GetFavBtn(UserID) {
    HistoryIsActivy = false
    getChapter("#list_fav")
    GetFavoriteList("authorize")
    url_get.searchParams.set("sh_user_fav", `${UserID}`)
    history.pushState({}, '', url_get);
}

document.getElementById('VoiceButtonMenu').addEventListener('click', () => {
    VoiceSettingsMenu()
})

document.getElementById('search_form').addEventListener('submit', function (e) {
    e.preventDefault()
    const formdata = new FormData(this)
    formdata.forEach((val, key) => {
        GetKodi(encodeURI(val))
    });

    // GetKodi(encodeURI(e.target.value))
})


document.getElementById("VideoInfoBtn").addEventListener('click', () => {
    let DialogVideoInfo = document.getElementById('DialogVideoInfo')
    DialogVideoInfo.classList.contains('DialogVideoInfoScroll') ? DialogVideoInfo.classList.remove("DialogVideoInfoScroll") : DialogVideoInfo.classList.add("DialogVideoInfoScroll")

})
document.addEventListener("search_another", function (e) {

    if (sh_api.another.status != 200) {
        getHome()
        load.show(false)
        return
    }
    GetFavoriteList("search_another")
    SetColorCartFav()
    if (url_get.searchParams.get('shikimori_id') || FavCheckSave == true) {
        FavCheckSave = false
        playSound("ok.mp3")
        return
    }
    getChapter("#list_fav")
    HistoryIsActivy = false
    
})

document.addEventListener("sh_api_logout", function (e) { // (1)
    base_anime.authorize = sh_api.authorize;
    localStorage.setItem('BaseAnime', JSON.stringify(base_anime));
})

document.addEventListener("authorize", function (e) { // (1)
    SetColorCartFav()
    base_anime.authorize = sh_api.authorize;
    localStorage.setItem('BaseAnime', JSON.stringify(base_anime));

    document.getElementById("list_login_Button").classList.add('hide')
    document.getElementById("User_Menu_Button").classList.remove('hide')
    document.getElementById("User_Menu_Button").querySelector('img').src = sh_api.UserData.avatar
    document.getElementById("User_Menu_Button").querySelector('span').textContent = sh_api.UserData.nickname

    const set2 = new Set(sh_api.Favorits.data.map(item => item.anime.id.toString()));
    const difference = base_anime.fav.filter(element => !set2.has(element));

    difference.length == 0 ? document.getElementById("User_cloud_sinc_button").classList.add("hide") : document.getElementById("User_cloud_sinc_button").classList.remove("hide")

    if (difference.length != 0) console.log("Несохранённых данных:", difference.length, difference)
    GetFavoriteList("authorize")
    btn_sh_save?.classList.remove("hide")

    if (!VideoInfo.e) return
    let tt = moment().add(moment.duration(VideoInfo.e.duration, 'minutes').asMilliseconds())
    switch (sh_api.Favorits.data.find(item => item.anime.id.toString() === VideoInfo.e.id)?.status) {
        case "watching":
            btn_sh_save.textContent = "смотрю"
            btn_sh_save.classList.add("btn-primary")
            btn_sh_save.classList.add("yellow")
            btn_sh_save.classList.add("yellow_bg")
            break;
        case "completed":
            btn_sh_save.textContent = "просмотренно"
            btn_sh_save.classList.add("btn-success")

            break;
        case "dropped":
            btn_sh_save.textContent = "брошено"
            btn_sh_save.classList.add("btn-danger")
            break;
        case "on_hold":
            btn_sh_save.textContent = "отложено"
            btn_sh_save.classList.add("btn-warning")
            break;
        case "planned":
            btn_sh_save.textContent = "запланировано"
            // btn_sh_save.classList.add("btn-secondary")
            btn_sh_save.classList.add("pink")
            btn_sh_save.classList.add("pink_bg")
            break;
        case "rewatching":
            btn_sh_save.textContent = "пересматриваю"
            btn_sh_save.classList.add("btn-info")
            break;
        default:
            btn_sh_save.textContent = "Добавить"
            btn_sh_save.classList.add("btn-outline-light")
            break;
    }
});


function GetFavoriteList(type) {
    var sh_f = type == "search_another" ? sh_api.another : sh_api

    // if (type == "search_another") sh_f = sh_api.another


    // document.getElementById("User_cloud_sinc_button")
    sh_f.status = sh_f.status ? sh_f.status : {
        name: {

        }
    }
    var status = {
        "num": {
            "watching": 0,
            "completed": 0,
            "dropped": 0,
            "on_hold": 0,
            "planned": 0,
            "rewatching": 0,
        },
        "name": [
            "смотрю",
            "просмотренно",
            "брошено",
            "отложено",
            "запланировано",
            "пересматриваю",
        ],
        "name2": [
            "watching",
            "completed",
            "dropped",
            "on_hold",
            "planned",
            "rewatching",
        ]
    }
    list_fav.querySelectorAll(".ned").forEach(e => {
        e.innerHTML = ""
    });

    document.querySelectorAll("#list_fav .ned_name").forEach((e, i) => {
        e.status = status.name2[i]
    });

    sh_f.Favorits.data.forEach(e => {
        if (e.status == "watching" && !base_anime.fav.includes(e.anime.id.toString()) && type == "authorize") {
            base_anime.fav.push(e.anime.id.toString())
            localStorage.setItem('BaseAnime', JSON.stringify(base_anime));
        }  //sh_f.Favorits.ids.push(e.anime.id)

        const e1 = {
            "title": e.anime.russian,
            "cover": `https://shikimori.one${e.anime.image.original}`,
            // "cover": `https://shikimori.one${base_anime.base[e.shikimori_id].image.original}`,
            "date": formatDate(e.updated_at),
            // "date": formatDate(base_anime.base[e.shikimori_id].next_episode_at),
            "voice": e.status,
            "series": e.anime.episodes ? e.anime.episodes : "M",
            "link": `https://kodik.cc/find-player?shikimoriID=${e.anime.id}`,
            "kp": null,
            "imdb": null,
            "shikimori": e.anime.id.toString(),
            "status": e.anime.status,
            "raiting": e.anime.score,
            "material_data": {
                poster_url: `https://shikimori.one${e.anime.image.original}`,
                anime_kind: `${e.anime.kind}`,
                anime_title: `${e.anime.russian}`,
                episodes_aired: `${e.anime.episodes_aired}`,
                episodes_total: `${e.anime.episodes}`,
                description: ``,
                anime_status: `${e.anime.status}`,
                anime_studios: ``,
                year: `${e.anime.aired_on}`,
                rating_mpaa: ``,
                shikimori_rating: `${e.anime.score}`,


            },
            "id": e.id,
            "screenshots": [],
            "e": e,
        }

        const cart = add_cart(e1)
        status.num[e.status] = status.num[e.status] ? status.num[e.status] + 1 : 1
        // sh_f.status.name[e.status] = sh_f.status.name[e.status] ? sh_f.status.name[e.status] : document.querySelector(`#fav_${e.status} .ned_name`).textContent
        document.querySelector(`#fav_${e.status} .ned`).appendChild(cart)
        // document.querySelector(`#fav_${e.status} .ned_name`).status = e.status
        load.show(false)
    });

    document.querySelectorAll("#list_fav .ned_name").forEach((e, i) => {
        e.textContent = `${status.name[i]} ${status.num[e.status]}`


    });
    // num.forEach(e => {
    //     document.querySelector(`#fav_${e.status} .ned_name`).textContent = `${sh_f.status.name[e.status]} ${num[e.status]}`
    // });

}

function GetFavUsersList(sh_user_fav) {
    if (!sh_user_fav) return

    load.show(true)
    sh_api.get_user(sh_user_fav, true)
}


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
getBackground()
function getBackground() {
    background = []
    fetch('DataList.json')
        .then(response => response.json())
        .then(jsonData => {
            jsonData.children.forEach(e1 => {
                if (e1.name == "bg") {
                    e1.children.forEach(e2 => {
                        background.push(e2.name)
                    });
                }
            });
            setInterval(() => {
                document.body.style.backgroundImage = `url(bg/${background[getRandomInt(background.length)]}) `
            }, 10 * 60 * 1000);
            document.body.style.backgroundImage = `url(bg/${background[getRandomInt(background.length)]}) `
        });

    // document.body.style.backgroundImage = `url(bg/7f623ee3f773bc93bc8422d3f1af9cd0aa441be0.jpg)`
}

function getChapter(name) {
    document.querySelectorAll(".anime_list").forEach(e => {
        e.classList.add("hide")
    });
    name ? document.querySelector(name).classList.remove("hide") : null
}

closeDialogButton.addEventListener('click', () => {
    VideoPlayerAnime.modal.hide();
    DialogVideoInfo.classList.remove("DialogVideoInfoScroll")
    url_get.searchParams.delete("shikimori_id")
    url_get.searchParams.delete("id")

    window.history.pushState({}, '', url_get);
    VideoPlayer.contentWindow.location.href = "loading.htm";
    return
});

document.getElementById("list_calendar_Button").addEventListener('mousedown', async (e) => {

    switch (e.button) {
        case 0:
            window.getCalendar()
            break;
        case 1:
            nTab = window.open(window.location.href, "_blank");
            nTab.onload = function () {
                nTab.getCalendar()
            };
            break;
        case 2:
            break;

        default:
            break;
    }
});
document.getElementById("list_home_Button").addEventListener('mousedown', async (e) => {

    switch (e.button) {
        case 0:
            window.getHome()
            break;
        case 1:
            nTab = window.open(window.location.href, "_blank");
            nTab.onload = function () {
                nTab.getHome()
            };
            break;
        case 2:
            break;

        default:
            break;
    }
});
document.getElementById("list_login_Button").addEventListener('click', async () => {
    sh_api.get_key()
});
document.getElementById("User_Logaut_button").addEventListener('click', async () => {
    sh_api.logout()
});
document.getElementById("User_cloud_sinc_button").addEventListener('click', async () => {
    load.classList.remove("hide")
    if (confirm(`Выгрузить все ваши лайки в "смотрю"?`)) {
        base_anime.fav.forEach((e, i) => {
            console.log(i, base_anime.fav.length)
            if (!sh_api.Favorits.ids.includes(base_anime.fav)) {
                setTimeout(() => {
                    sh_api.AddUserRates(e.toString(), 0);
                    console.log("Выгружено ", e, 500 * i);
                }, 500 * i)
            };
            if (base_anime.fav.length == i + 1) setTimeout(() => load.classList.add("hide"), (500 * i) + 100)
        });
    }
});

/* VideoPlayerAnime.addEventListener("close", () => {
    document.title = "Track Anime By ДугДуг"
}); */

VideoPlayerAnime.addEventListener('hidden.bs.modal', e => {
    // VideoPlayerAnime.modal.focus()
    document.title = "Track Anime By ДугДуг"
    url_get.searchParams.delete("shikimori_id")
    window.history.pushState({}, '', url_get);
})


// window.onscroll = function () {
container_.addEventListener('scroll', async function (e) {
    if (container_.clientHeight + container_.scrollTop > container_.scrollHeight - scrollM && HistoryIsActivy && !ld) {
        GetKodi()
        // setTimeout(GetKodi, 0)
    }
});




///////////////////// GET параметры 
get_settings()
async function get_settings() {
    if (url_get.searchParams.get('id') || url_get.searchParams.get('shikimori_id')) {

        /*         e = await httpGet(url_get.searchParams.get('shikimori_id') ?
                    `https://kodikapi.com/search?token=45c53578f11ecfb74e31267b634cc6a8&with_material_data=true&shikimori_id=${url_get.searchParams.get('shikimori_id')}` :
                    `https://kodikapi.com/search?token=45c53578f11ecfb74e31267b634cc6a8&with_material_data=true&id=${url_get.searchParams.get('id')}`
                ) */
        e = await httpGet(url_get.searchParams.get('shikimori_id') ?
            `https://shikimori.one/api/animes/${url_get.searchParams.get('shikimori_id')}` :
            `https://shikimori.one/api/animes/${url_get.searchParams.get('id')}`
        )
        console.log(1, e)
        if (e.code == "404") {
            url_get.searchParams.delete("id")
            url_get.searchParams.delete("shikimori_id")
            return
        }
        const ed = {
            "title": e.russian,
            "cover": e.image?.original,
            // "cover": `https://shikimori.one${base_anime.base[e.shikimori_id].image.original}`,
            "date": formatDate(e.released_on),
            // "date": formatDate(base_anime.base[e.shikimori_id].next_episode_at),
            "voice": formatDate(e.released_on).moment.format('dddd'),
            "series": e.episodes_count ? e.episodes_count : "M",
            "link": e.link,
            "kp": e.kinopoisk_id,
            "imdb": e.imdb_id,
            "shikimori": e.id,
            "status": e.status,
            "raiting": e.score,
            // "material_data": e.material_data,
            "id": e.id,
            "screenshots": e.screenshots,
            "e": e,

        }
        console.log(3, ed)
        dialog_(ed, true)
    }
}
// url_get.searchParams.delete("seartch")

async function getHome(iss) {
    // location.reload()
    HistoryIsActivy = true
    TypePage = 0
    getChapter("#list_serch")
    url_get.searchParams.delete("sh_user_fav")
    window.history.pushState({}, '', url_get);
    nav_panel_buttons.querySelectorAll('button').forEach((e) => {
        e.classList.remove("active")
    })
    nav_panel_buttons.querySelector("#list_home_Button").classList.add("active")
    if (!iss) {
        document.getElementById('search_input').value = "";
        url_get.searchParams.delete("seartch");
        window.history.pushState({}, '', url_get);
        GetKodi()
    }

}

async function getCalendar() {
    nav_panel_buttons.querySelectorAll('button').forEach((e) => {
        e.classList.remove("active")
    })
    nav_panel_buttons.querySelector("#list_calendar_Button").classList.add("active")

    HistoryIsActivy = false
    TypePage = 1
    // var tmp1 = list_calendar.getElementsByClassName('ned')
    // .classList.remove('active')
    document.getElementById("load").classList.remove("hide")
    document.getElementById("list_calendar").classList.add("hide")

    setTimeout(addCalendar, 10)
}

async function addCalendar() {
    document.getElementById('search_input').value = ""
    getChapter("#list_calendar")

    var URLCalendarAdd = URLCalendar;
    var data = []
    var d1
    var d3 = list_calendar.getElementsByClassName('ned')

    for (let i = 0; i < d3.length; i++) {
        d3[i].innerHTML = ""
    }

    // return
    while (URLCalendarAdd) {
        d1 = await httpGet(URLCalendarAdd)
        var d2 = data
        var id = []
        data = d2.concat(d1.results)
        URLCalendarAdd = d1.next_page
    }
    data.forEach(e => {
        if ((e.type == 'anime-serial') && e.translation.type == "voice" && e.shikimori_id && e.material_data.shikimori_rating > 0 && e.material_data.countries != "Китай") {  //&& (e.material_data.countries != "Китай"||CheckChinaTrash)  && (e.material_data.countries != "Китай"||document.getElementById("CheckChinaTrash"))
            if (id.includes(e.shikimori_id)) return
            id.push(e.shikimori_id)
            const e1 = {
                "title": e.material_data.anime_title,
                "cover": `${e.material_data.poster_url}`,
                // "cover": `https://shikimori.one${base_anime.base[e.shikimori_id].image.original}`,
                "date": formatDate(e.material_data.next_episode_at),
                // "date": formatDate(base_anime.base[e.shikimori_id].next_episode_at),
                "voice": formatDate(e.material_data.next_episode_at).moment.format('dddd'),
                "series": e.episodes_count ? e.episodes_count : "M",

                "link": e.link,
                "kp": e.kinopoisk_id,
                "imdb": e.imdb_id,
                "shikimori": e.shikimori_id,
                "status": e.material_data.all_status,
                "raiting": e.material_data.shikimori_rating,
                "material_data": e.material_data,
                "id": e.id,
                "screenshots": e.screenshots,
                "e": e,
            }
            const cart = add_cart(e1)
            formatDate(e.material_data.next_episode_at).moment.day() == 0 ? d3[6].appendChild(cart) : d3[formatDate(e.material_data.next_episode_at).moment.day() - 1].appendChild(cart)
        }
    });
    var ned_num = formatDate().moment.day() > 0 ? formatDate().moment.day() - 1 : 6
    list_calendar.getElementsByClassName('ned_spoiler')[ned_num].open = true
    list_calendar.getElementsByClassName('ned_name')[ned_num].scrollIntoView({ behavior: "smooth", block: "start", inline: "start" })
    document.getElementById("load").classList.add("hide")
}


async function add_push(e) {
    if (!GetFavorite(e.shikimori) && base_anime.fav.length > 0) return
    showToast(e);
    return

    const perm = await window?.Notification?.requestPermission()

    // return showToast(e);

    if (perm != "granted" || perm == undefined) {
        showToast(e);
        return
    }

    const notification = new Notification(e.title,
        {
            body: `Серия ${e.series} в озвучке ${e.voice}`,
            // tag: e.date.string,
            icon: e.cover,
        })

    notification.addEventListener("click", (event) => {
        e.shift = event.shiftKey
        dialog_(e, !event.shiftKey)
    })

}

function AddFavorite(t) {
    console.log(t)

    var e1 = document.getElementById('btn_sh_save')

    e1.classList.remove("btn-outline-light")
    e1.classList.remove("btn-primary")
    e1.classList.remove("yellow")
    e1.classList.remove("yellow_bg")
    e1.classList.remove("btn-success")
    e1.classList.remove("btn-danger")
    e1.classList.remove("btn-warning")
    e1.classList.remove("btn-secondary")
    e1.classList.remove("pink")
    e1.classList.remove("pink_bg")
    e1.classList.remove("btn-info")

    switch (t) {
        case 0:
            e1.textContent = "смотрю"
            e1.classList.add("btn-primary")
            e1.classList.add("yellow")
            e1.classList.add("yellow_bg")
            SetFavorite(e1.ids)
            break;
        case 1:
            DeleteFavorite(e1.ids)
            e1.textContent = "просмотренно"
            e1.classList.add("btn-success")

            break;
        case 2:
            e1.textContent = "брошено"
            e1.classList.add("btn-danger")
            DeleteFavorite(e1.ids)
            setTimeout(() => {
                sh_api.AddUserRates(Number(e1.ids), t)
            }, 500);
            break;
        case 3:
            e1.textContent = "отложено"
            e1.classList.add("btn-warning")
            DeleteFavorite(e1.ids)
            setTimeout(() => {
                sh_api.AddUserRates(Number(e1.ids), t)
            }, 500);
            break;
        case 4:
            e1.textContent = "запланировано"
            // e1.classList.add("btn-secondary")
            e1.classList.add("pink")
            e1.classList.add("pink_bg")
            DeleteFavorite(e1.ids)
            setTimeout(() => {
                sh_api.AddUserRates(Number(e1.ids), t)
            }, 500);
            break;
        case 5:
            e1.textContent = "пересматриваю"
            e1.classList.add("btn-info")
            DeleteFavorite(e1.ids)
            setTimeout(() => {
                sh_api.AddUserRates(Number(e1.ids), t)
            }, 500);
            break;
        default:
            e1.textContent = "Добавить"
            e1.classList.add("btn-outline-light")
            DeleteFavorite(e1.ids)
            setTimeout(() => {
                sh_api.AddUserRates(Number(e1.ids), t)
            }, 500);
            break;
    }
}
document.getElementById("User_clear_fav_button").onclick = ClearFavorite

function ClearFavorite() {
    // alert("restart")
    if (!confirm("Очистить локальную базу данных?")) return
    base_anime.fav = [];
    localStorage.setItem('BaseAnime', JSON.stringify(base_anime));
    location.reload()
}

function SetFavorite(e) {
    console.log("SetFavorite", e)
    FavCheckSave = true
    base_anime.fav.push(e.toString())
    localStorage.setItem('BaseAnime', JSON.stringify(base_anime));
    sh_api.AddUserRates(Number(e), 0)

    return base_anime.fav
}

function DeleteFavorite(e) {
    FavCheckSave = true
    console.log("DeleteFavorite", e)
    base_anime.fav = base_anime.fav.filter(item => !item.includes(e.toString()));
    localStorage.setItem('BaseAnime', JSON.stringify(base_anime));
    sh_api.AddUserRates(Number(e), 1)
    return base_anime.fav
}

function GetFavorite(e) {
    let result = base_anime.fav.filter(item => item.toString().toLowerCase().includes(e.toString().toLowerCase()));
    if (result.length > 0) {
        return true
    }
    return false
}
function VoiceSettingsMenu() {
    VoiceSettings.innerHTML = ""
    const checkboxList = document.getElementById('checkbox-list');
    const buttonContainer = document.getElementById('button-container');

    base_anime.translation.sort().forEach((voice, index) => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `voice-${index}`;
        checkbox.className = 'form-check-input';
        checkbox.checked = base_anime.translationActive.includes(voice);

        const checkboxLabel = document.createElement('label');
        checkboxLabel.htmlFor = `voice-${index}`;
        checkboxLabel.className = 'form-check-label';
        checkboxLabel.textContent = voice;
        checkboxLabel.classList.add(encodeURIComponent(voice));

        const checkboxDiv = document.createElement('div');
        checkboxDiv.className = 'form-check';
        checkboxDiv.appendChild(checkbox);
        checkboxDiv.appendChild(checkboxLabel);

        checkbox.checked ? VoiceSettings.prepend(checkboxDiv) : VoiceSettings.appendChild(checkboxDiv);
    });

    const saveButton = document.createElement('button');
    saveButton.type = 'button';
    saveButton.className = 'btn btn-primary yellow mt-3';
    saveButton.textContent = 'Сохранить';
    VoiceSettings.prepend(saveButton)
    saveButton.addEventListener('click', () => {
        base_anime.translationActive = [];
        const checkboxes = document.querySelectorAll('.form-check-input');

        checkboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                base_anime.translationActive.push(checkbox.nextElementSibling.textContent);
            }
        });
        if (base_anime.translationActive.length > 0) localStorage.setItem('BaseAnime', JSON.stringify(base_anime));
        // VoiceSettings.innerHTML = ""
        VoiceSettings.modal.hide()
        location.reload();
    });

    VoiceSettings.modal.show()

}
async function httpGet(theUrl) {
    var response = await fetch(theUrl);
    const data = await response.json();
    return data
}
/* function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp;
} */


RangeRaitingObj = document.getElementById('RangeRaiting')
RangeRaitingObj.addEventListener("input", RangeRaiting);
RangeRaitingObj.addEventListener("change", () => { GetKodi() });
RangeRaitingObj.title = `Фильтр по минимальному рейтингу: ${RangeRaitingObj.value}`
document.getElementById('RangeRaitingTitle').textContent = `Рейтинг: ${RangeRaitingObj.value}`
function RangeRaiting(r) {
    document.body.r = r.target.value;
    r.target.title = `Фильтр по минимальному рейтингу: ${r.target.value}`
    document.getElementById('RangeRaitingTitle').textContent = `Рейтинг: ${r.target.value}`
    document.body.querySelectorAll(".cart_").forEach(e => {
        e.r < r.target.value ? e.classList.add('hide') : e.classList.remove('hide')

    })
}
function SetColorCartFav() {
    document.querySelectorAll(".cart_").forEach(e => {
        if(e?.data?.shikimori==undefined) return
        if (sh_api.authorize == true) {
           e.style.borderTopColor = sh_api.status_color[sh_api?.Favorits?.data?.find(item => item.anime.id.toString() === e?.data?.shikimori.toString())?.status]?.[0] ? sh_api.status_color[sh_api?.Favorits?.data?.find(item => item.anime.id.toString() === e?.data?.shikimori.toString())?.status]?.[0] : "none"
            // e.style.borderTopColor = GetFavorite(e?.data?.shikimori) ? "#ffdd00" : "none"
        } else {
            e.style.borderTopColor = GetFavorite(e?.data?.shikimori) ? "#ffdd00" : "none"
        }
        // console.log(e?.data?.shikimori)
    });
}

function add_cart(e) {
    const cart = document.createElement('div');
    cart.data = e;
    // console.log(cart.data.shikimori)
    cart.classList.add('cart_', 'bg-dark', 'text-white');
    cart.r = e.raiting
    document.body.r > cart.r ? cart.classList.add('hide') : null;

    const imgTop = document.createElement('div');
    imgTop.style.backgroundImage = `url(${e.cover}`;
    imgTop.src = e.cover;
    imgTop.classList.add('cart-img-top');
    imgTop.alt = 'cover';
    cart.appendChild(imgTop);

    imgTop.addEventListener("mousedown", (event) => {
        var a = new URL(window.location.href)
        a.searchParams.set("shikimori_id", `${e.shikimori}`)
        if (event.button == 1) {
            var newTab = window.open(a.href, '_blank')
            return
        }
        if (event.button == 2) return

        e.shift = event.shiftKey
        dialog_(e, !event.shiftKey)
        cart.classList.remove("new_cart")
    })


    const cartTitle = document.createElement('h5');
    cartTitle.classList.add('cart-title');
    cartTitle.textContent = e.title;
    cartTitle.title = e.title;
    imgTop.appendChild(cartTitle);


    const cartTime = document.createElement('h5');
    cartTime.classList.add('cart-time');
    cartTime.textContent = e.date.moment.calendar();
    cartTime.title = e.date.moment.calendar();
    imgTop.appendChild(cartTime);

    const cartCal = document.createElement('h5');
    cartCal.classList.add('cart-cal');
    cartCal.textContent = e.date.moment.fromNow();//
    cartCal.title = e.date.moment.format('MMMM Do YYYY, HH:mm:ss'); //${days.name[Number(days.dayOfWeek)]}
    cartCal.style.color = e.kp ? "#ffcccc" : "#ffffff"
    cartCal.style.color = e.imdb ? "#daedff" : "#ffffff"
    cartTime.appendChild(cartCal);

    const cartVoice = document.createElement('h5');
    cartVoice.classList.add('cart-voice');
    cartVoice.classList.add(encodeURIComponent(e.voice));
    cartVoice.textContent = e.voice;
    cartVoice.title = e.status;
    imgTop.appendChild(cartVoice);

    cartVoice.addEventListener("mouseover", (e1) => {

        if (AnimeScanID[e.shikimori])
            var tmp123 = ' | ';
        AnimeScanID[e.shikimori]?.forEach(e2 => {

            tmp123 = tmp123 + e2 + " | "
        });
        e1.target.title = tmp123 ? tmp123 : ""
    });

    const cartRaiting = document.createElement('div');

    cartRaiting.classList.add('cart-raiting');
    cartRaiting.innerHTML = `
    <div class="progress cartRaitingProgress progress-bar-vertical ">
    <div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="height: 60%;">
      <span class="sr-only">60% Complete</span>
    </div>
  </div>
    `
    cartRaiting.r = e.raiting
    cartRaiting.title = `Рейтинг шикимори: ${e.raiting}`
    cartRaiting.label = cartRaiting.querySelector(".sr-only")
    cartRaiting.progress = cartRaiting.querySelector(".progress-bar")
    cartRaiting.progress.style.height = `${e.raiting * 10}%`
    cartRaiting.label.textContent = `Рейтинг шикимори: ${e.raiting}`

    imgTop.appendChild(cartRaiting);

    const cartSeries = document.createElement('h5');
    cartSeries.classList.add('cart-series');
    cartSeries.textContent = e.series;
    cartSeries.title = e.status;
    cartSeries.style.color = e.kp ? "#ffa9a9" : "#ffffff"
    cartSeries.style.color = e.imdb ? "#a9d5ff" : "#ffffff"
    cartSeries.style.color = e.status == "released" ? "#a9ffb4" : "#ffffff"
    imgTop.appendChild(cartSeries);


    const cartFavorite = document.createElement('div');
    cartFavorite.classList.add('cart-fav');
    // cartFavorite.textContent = "♥";
    cartFavorite.innerHTML = `<svg style="fill: rgb(255 255 255); stroke: rgb(255, 255, 255); stroke-width: 1; width: 30px; height: 40px;" class="heart-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>`
    // cartFavorite.title = e.series;
    cart.appendChild(cartFavorite);
    // cartFavorite.querySelector('svg').style.fill = GetFavorite(e.shikimori) ? "#ffdd00" : "#ffffff"
    cartFavorite.querySelector('svg').style.fill = sh_api.get_fav_color(e.shikimori) ? sh_api.get_fav_color(e.shikimori)[0] : GetFavorite(e.shikimori) ? "#ffdd00" : "#ffffff"
    cartFavorite.title = sh_api.get_fav_color(e.shikimori) ? sh_api.get_fav_color(e.shikimori)[1] : GetFavorite(e.shikimori) ? "В избранном" : "не добавлено";

    cart.addEventListener("mouseover", (ev) => {
        if (sh_api.authorize) {
            cartFavorite.querySelector('svg').style.fill = sh_api.get_fav_color(e.shikimori)[1]
        } else {
            cartFavorite.querySelector('svg').style.fill = GetFavorite(e.shikimori) ? "#ffdd00" : "#ffffff"
        }
        // cartFavorite.querySelector('svg').style.fill = sh_api.get_fav_color(e.shikimori) ? sh_api.get_fav_color(e.shikimori)[0] : GetFavorite(e.shikimori) ? "#ffdd00" : "#ffffff"
    });

    cartFavorite.addEventListener("click", (ev) => {
        console.log(ev)
        ev.stopPropagation();
        console.log(sh_api.get_fav_color(e.shikimori), GetFavorite(e.shikimori))
        if (GetFavorite(e.shikimori) || sh_api?.get_fav_color(e.shikimori)?.[1] == "смотрю") {
            cartFavorite.querySelector('svg').style.fill = sh_api.get_fav_color(e.shikimori) ? sh_api.get_fav_color(e.shikimori)[0] : GetFavorite(e.shikimori) ? "#ffdd00" : "#ffffff"
            // cartFavorite.querySelector('svg').style.fill = "#ffffff"
            DeleteFavorite(e.shikimori)
            cartFavorite.title = sh_api.get_fav_color(e.shikimori) ? sh_api.get_fav_color(e.shikimori)[1] : GetFavorite(e.shikimori) ? "В избранном" : "не добавлено";
        } else {
            cartFavorite.querySelector('svg').style.fill = sh_api.get_fav_color(e.shikimori) ? sh_api.get_fav_color(e.shikimori)[0] : GetFavorite(e.shikimori) ? "#ffdd00" : "#ffffff"
            // cartFavorite.querySelector('svg').style.fill = "#ffdd00"
            SetFavorite(e.shikimori)
            cartFavorite.title = sh_api.get_fav_color(e.shikimori) ? sh_api.get_fav_color(e.shikimori)[1] : GetFavorite(e.shikimori) ? "В избранном" : "не добавлено";
        }


    })
    // setTimeout(() => cart.classList.add("cart_spawn"), 0)
    //border-top-color: green;
    // cart.style.borderTopColor = 
    // console.log(e)
    var id = e.shikimori ? e.shikimori : e.id
    // console.log(sh_api?.Favorits?.data?.find(item => item.anime.id.toString() === id.toString())?.status)
    // console.log(sh_api.status_color[sh_api?.Favorits?.data?.find(item => item.anime.id.toString() === id.toString())?.status]?.[0])
    if (sh_api.authorize == true) {
        cart.style.borderTopColor = sh_api.status_color[sh_api?.Favorits?.data?.find(item => item.anime.id.toString() === id.toString())?.status]?.[0] ? sh_api.status_color[sh_api?.Favorits?.data?.find(item => item.anime.id.toString() === id.toString())?.status]?.[0] : "none"
    } else {
        cart.style.borderTopColor = GetFavorite(id) ? "#ffdd00" : "none"
    }
    return cart
}

function add_card_ned(e) {
    const cart = document.createElement('div');
    cart.classList.add("cart_")
    // cart.classList.add("bg-dark")
    cart.classList.add("cart_n_bg")
    // ${e.cart_data_old.n == "сб" || e.cart_data_old.n == "вс" ? "#ff00002e" : "#1900ff2e"}
    cart.innerHTML = `
    <div class="cart_n">
        <div align="center" style=" font-size: 3em;wight=50%;width: 50%;height: 100%;background-color:#5151518f;border-color: #dee2e6;border-style: solid;border-width: 0.3rem;border-radius: 15px 0px 0px 15px;">
            <div align="center" style=";height: 25%;background-color: ${e.cart_data_old.nn > 0 ? `hwb(${190 / 7 * e.cart_data_old.nn + 190}deg 0% 0% / 18.04%);` : "hwb(0deg 0% 0% / 18.04%)"}">${e.cart_data_old.n}</div>
        ${e.cart_data_old.dat}<br>◄</div>
        <div align="center" style="font-size: 3em;wight=50%;width: 50%;height: 100%;background-color:#5151518f;border-color: #dee2e6;border-style: solid;border-width: 0.3rem;border-radius: 0px 15px 15px 0px;">
            <div align="center" style=";height: 25%;background-color: ${e.cart_data_new.nn > 0 ? `hwb(${190 / 7 * e.cart_data_new.nn + 190}deg 0% 0% / 18.04%);` : "hwb(0deg 0% 0% / 18.04%)"}">${e.cart_data_new.n}</div>
        ${e.cart_data_new.dat}<br>►</div>
    </div>
    `
    return cart
}

function formatDate(isoDateString) {
    var days = {}
    var data

    days.moment = moment.utc(isoDateString)
    days.name = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
    days.name_s = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

    if (isoDateString) {
        date = new Date(isoDateString)
    } else {
        date = new Date()
    };

    days.day = String(date.getDate()).padStart(2, '0');
    days.month = String(date.getMonth() + 1).padStart(2, '0');
    days.year = date.getFullYear();
    days.hours = String(date.getHours()).padStart(2, '0');
    days.minutes = String(date.getMinutes()).padStart(2, '0');
    days.seconds = String(date.getSeconds()).padStart(2, '0');
    days.dayOfWeek = Number(String(date.getDay()).padStart(2, '0'));
    days.dayOfWeek_n = days.moment.format('dddd');
    days.dayOfWeek_ns = days.name_s[days.dayOfWeek + 1]
    days.string = `${days.moment.calendar()}`
    days.moment_7 = moment.utc(isoDateString)
    days.moment_7.add(7, 'days')
    return days;
}
function playSound(soundFile) {
    var audioElement = new Audio(soundFile);
    audioElement.preload = 'auto';
    audioElement.play();
  }

function showToast(e, fav) {
    // prompt("",JSON.stringify(e))
    audio.src = playSound('./meloboom.mp3');
    var toast0 = document.createElement('div');
    document.getElementById('ToastsMain').appendChild(toast0)

    toast0.innerHTML = `
    <div class="toast liveToast" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false" style="user-select: none;">
    <div class="toast-header">
      <img src="${e.cover}" style="height: 75px;" class="imgs rounded me-2" alt="...">
      <strong class="${encodeURIComponent(e.voice)} me-auto">${fav ? fav : e.voice}</strong>
      <small class="text-muted">${e.date.string}</small>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Закрыть"></button>
    </div>
    <div class="toast-body">
      ${e.title}
    </div>
  </div>
    `;


    var toast1 = new bootstrap.Toast(toast0.querySelector(".liveToast"));

    toast0.addEventListener('hidden.bs.toast', function (e) {
        toast0.remove()
    })
    toast1.show();

    toast0.querySelector(".toast-header").addEventListener("click", (ev) => {
        toast1.hide();
    })

    // toast0.show();
    // toast.dispose()
}
document.addEventListener("sh_get_anime", function (e) {
    console.log("sh_get_anime", e.anime)
    // console.log(`https://shikimori.one${e.anime.image.original}`)
    const e1 = {
        "title": e.anime.anime_title,
        // "cover": e.anime.image.original,
        "cover": `https://shikimori.one${e.anime.image.original}`,
        "date": formatDate(e.updated_at),
        // "date": formatDate(base_anime.base[e.shikimori_id].next_episode_at),
        "voice": e.anime.title,
        "series": e.anime.episodes_count ? e.episodes_count : "M",
        "link": `//kodik.info/find-player?shikimoriID=${e.anime.id}&camrip=false`,
        // "link": e.anime.link,
        "kp": e.anime.kinopoisk_id,
        "imdb": e.anime.imdb_id,
        "shikimori": e.shikimori_id,
        "status": e.anime.all_status,
        "raiting": e.anime.score,
        "material_data": {
            poster_url: `https://shikimori.one${e.anime.image.original}`,
            anime_kind: `${e.anime.kind}`,
            anime_title: `${e.anime.russian}`,
            episodes_aired: `${e.anime.episodes_aired}`,
            episodes_total: `${e.anime.episodes}`,
            description: e.anime.description_html,
            // description: e.anime.description,
            anime_status: e.anime.status,
            anime_studios: e.anime.studios[0] ? e.anime.studios[0].filtered_name : "?",
            year: e.anime.aired_on,
            rating_mpaa: ``,
            shikimori_rating: e.anime.score,


        },
        "id": e.anime.id,
        "screenshots": e.anime.screenshots,
        "e": e.anime,

    }
    setVideoInfo(e.anime)
})

function dialog_(e, info) {
    VideoPlayerAnime.pip = VideoPlayerAnime.pip ? VideoPlayerAnime.pip : false
    if (e.shift) {
        // return
        if (confirm(`Добавить аниме "${e.title}" в список "смотрю" на shikimori?`)) {
            // AddUserRates(e.shikimori)
        };

        //showToast(e);
        // add_push(e)
        return
    }
    // console.log(e.shikimori, info)
    console.log(2, e)
    sh_api.get_anime(e.shikimori)
    load.show(true)
    // setVideoInfo(e)
    url_get.searchParams.set("shikimori_id", `${e.shikimori}`)
    window.history.pushState({}, '', url_get);
    document.title = `TA: ${e.title}`



    VideoPlayerAnime.modal.show();

    // if ((e.imdb || e.kp) && e.shift) {
    //     VideoPlayer.contentWindow.location.href = e.kp ? `//dygdyg.github.io/DygDygWEB/svetacdn.htm?loadserv=kinobox&kinopoiskID=${e.kp}` : `//dygdyg.github.io/DygDygWEB/svetacdn.htm?loadserv=kinobox&imdb=${e.imdb}`
    //     return
    // }

    VideoPlayer.contentWindow.location.href = e.link

    info ? DialogVideoInfo.classList.add("DialogVideoInfoScroll") : DialogVideoInfo.classList.remove("DialogVideoInfoScroll")

    ta_pip(false)
}

function ta_pip(flag) //picture to picture
{
    if (typeof flag != "boolean" && typeof flag != "undefined") return console.log("Ну и что это такое?")
    VideoPlayerAnime.pip = typeof flag == "boolean" ? flag : !VideoPlayerAnime.pip

    if (VideoPlayerAnime.pip == true) {
        // VideoPlayerAnime.pip = true
        document.querySelector("#VideoPlayerAnime").classList.add("ta_modal")
        document.querySelector("#VideoPlayerAnime").classList.remove("modal")
        document.querySelector(".modal-backdrop").classList.add("ta_modal-backdrop_hide")
        document.querySelector("#DialogVideoInfo").classList.remove("DialogVideoInfoScroll")
    }
    if (VideoPlayerAnime.pip == false) {
        // VideoPlayerAnime.pip = false
        document.querySelector("#VideoPlayerAnime").classList.remove("ta_modal")
        document.querySelector("#VideoPlayerAnime").classList.add("modal")
        document.querySelector(".modal-backdrop").classList.remove("ta_modal-backdrop_hide")
        // document.querySelector("#DialogVideoInfo").classList.add("DialogVideoInfoScroll")
    }
    return VideoPlayerAnime.pip
}



function VoiceTranslate(name) {

    if (ignoreVoice || base_anime.translationActive < 1) return true
    if (base_anime.translationActive) {
        return base_anime.translationActive.includes(name)
    } else {
        base_anime.translationActive = voice;
        return voice.includes(name)
    }

}
document.addEventListener("sh_api_search", function (e) {
    load.show(false)
    if (e.search == 404) return

    getHome(true)
    HistoryIsActivy = false
    ignoreVoice = true
    targetFrame = document.getElementById('list_history')
    targetFrame.innerHTML = ""
    getChapter("#list_history")
    e.search.forEach(e => {
        // console.log(e)
        // return
        const e1 = {
            "title": e.russian,
            // "cover": e.image.original,
            "cover": `https://shikimori.one${e.image.original}`,
            "date": formatDate(e.aired_on),
            // "date": formatDate(base_anime.base[e.shikimori_id].next_episode_at),
            "voice": e.status,
            "series": e.episodes ? e.episodes : "M",
            "link": e.link,
            "kp": "",
            "imdb": "",
            "shikimori": e.id,
            "status": e.status,
            "raiting": e.score,
            "material_data": [],
            "id": e.id,
            "screenshots": [],
            "e": [],

        }
        const cart = add_cart(e1)
        targetFrame.appendChild(cart)
    })

})

function get_seartch(search) {
    url_get = new URL(window.location.href)
    url_get.searchParams.set("seartch", `${search}`)
    window.history.pushState({}, '', url_get);

    load.show(true)
    sh_api.search(search)
}

// get_seartch("мастера меча онлайн")
async function GetKodi(seartch, revers) {
    ld = true
    // if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - scrollM && HistoryIsActivy == true && document.getElementById('search_input').value ) {
    // if(container_.clientHeight + container_.scrollTop > container_.scrollHeight - scrollM){
    if ((window.innerHeight + window.scrollY) >= container_.offsetHeight - scrollM) {
        if ((!seartch || seartch == undefined || seartch == "")) {
            getChapter("#list_serch")
            HistoryIsActivy = true
            ignoreVoice = false
            // document.getElementById('list_history').classList.add("hide")

            targetFrame = document.getElementById('list_serch')

            if (revers) {
                dat = await httpGet(URLListStart)
                endid2 = dat.results[0].id
            } else {
                dat = await httpGet(URLList)
                URLList = dat.next_page
                endid = endid ? endid : dat.results[0].id

            }

        } else {

            getHome(true)
            HistoryIsActivy = false
            ignoreVoice = true
            document.getElementById('search_input').value = decodeURIComponent(seartch)
            targetFrame = document.getElementById('list_history')
            getChapter("#list_history")
            targetFrame.innerHTML = ""
            dat1 = await httpGet(`${URLSearch}${seartch}`)
            dat = {}

            dat.results = dat1.results.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.shikimori_id === value.shikimori_id
                ))
            );

            url_get = new URL(window.location.href)
            url_get.searchParams.set("seartch", `${seartch}`)
            window.history.pushState({}, '', url_get);
            get_seartch(seartch)
            return
        }
        data = dat.results
        prev_page = dat.prev_page


        GetKodiScan(data, revers)
        // container_.scrollHeight
        if (container_.clientHeight + container_.scrollTop > container_.scrollHeight - scrollM && HistoryIsActivy) {
            // setTimeout(GetKodi, 0)

            GetKodi()
        }
        ld = false
        return seartch
    }
}
// }

url_get.searchParams.get('sh_user_fav') ? GetFavUsersList(url_get.searchParams.get('sh_user_fav')) : GetKodi(url_get.searchParams.get('seartch'))




function GetKodiScan(data, revers) {

    var t1 = false
    data.forEach(e => {

        if (revers && endid == e.id || t1) {

            t1 = true
            endid = endid2
            return
        }
        if ((e.type == 'anime-serial' || e.type == "anime") && e.translation.type == "voice" && e.shikimori_id && e.material_data.shikimori_rating > 0 && e.material_data.countries != "Китай") {  //&& e.material_data.countries != "Китай"

            if (VoiceTranslate(e.translation.title)) {


                if (!e.shikimori_id) return
                const e1 = {
                    "title": e.material_data.anime_title,
                    "cover": `${e.material_data.poster_url}`,
                    // "cover": `https://shikimori.one${base_anime.base[e.shikimori_id].image.original}`,
                    "date": formatDate(e.updated_at),
                    // "date": formatDate(base_anime.base[e.shikimori_id].next_episode_at),
                    "voice": e.translation.title,
                    "series": e.episodes_count ? e.episodes_count : "M",
                    "link": e.link,
                    "kp": e.kinopoisk_id,
                    "imdb": e.imdb_id,
                    "shikimori": e.shikimori_id,
                    "status": e.material_data.all_status,
                    "raiting": e.material_data.shikimori_rating,
                    "material_data": e.material_data,
                    "id": e.id,
                    "screenshots": e.screenshots,
                    "e": e,

                }

                const cart = add_cart(e1)

                if (revers && prev_page == null) {
                    targetFrame.prepend(cart)
                    cart.classList.add("new_cart")
                    add_push(e1)
                } else {
                    const seartch = document.getElementById("search_input").value
                    if (cart_data && (!seartch || seartch == undefined || seartch == "")) {
                        if (cart_data.dat != e1.date.moment.format("DD")) {
                            const e2 = Object.assign(e1, {
                                "cart_data_old": cart_data,
                                "cart_data_new": {
                                    "dat": e1.date.moment.format("DD"),
                                    "n": e1.date.moment.format("dd"),
                                    "nn": e1.date.moment.format("d"),
                                }
                            })
                            targetFrame.appendChild(add_card_ned(e2))
                            cart_data = {
                                "dat": e1.date.moment.format("DD"),
                                "n": e1.date.moment.format("dd"),
                                "nn": e1.date.moment.format("d"),
                            }
                        }
                    } else {
                        cart_data = {
                            "dat": e1.date.moment.format("DD"),
                            "n": e1.date.moment.format("dd"),
                            "nn": e1.date.moment.format("d"),
                        }
                    }
                    targetFrame.appendChild(cart)

                    /*                     if (!AnimeScanID[e.shikimori_id]) {
                                            AnimeScanID[e.shikimori_id] = new Array()
                                            AnimeScanID[e.shikimori_id].push(e.translation.title)
                                            targetFrame.appendChild(cart)
                                        } else {
                                            AnimeScanID[e.shikimori_id].push(e.translation.title)
                                        } */
                };
            }
            if (!base_anime.translation) base_anime.translation = [];
            if (!base_anime.translationActive) base_anime.translationActive = voice;
            if (!base_anime.translation.includes(e.translation.title)) base_anime.translation.push(e.translation.title);
        }

    });
}
localStorage.setItem('BaseAnime', JSON.stringify(base_anime));






