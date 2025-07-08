var data, dat, targetFrame, endid, endid2, prev_page, SH_UserData, SH_Favorite, cart_data, backgrounds;
var ld = false, SH_isAvtorize = false;
var AnimeScanID = {}
var AnimeInfo = {}
const scrollM = 2000;
var ignoreVoice = false
window.moment.locale('ru')
var HistoryIsActivy = true
var TypePage = 0
document.body.r = 2
var FavCheckSave = false
var reiting_off = false
var isDebugEnabled = false
var error_timeoud_hide = false
var cart_list = []

var BaseAnimeCurrent = JSON.parse(localStorage.getItem('BaseAnimeCurrent')) || {};

// var MyServerURL = 'https://dygdyg.duckdns.org'    //Адрес сервера

var url_get = new URL(window.location.href)

const MyServerURL = url_get.searchParams.get('MyServerURL') ? url_get.searchParams.get('MyServerURL') : 'server.dygdyg.ru' //'dygdyg.duckdns.org'
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
const list_resume = document.getElementById("list_resume");
const styleDateCart = document.createElement("style")
const ChecDataCart = document.getElementById("ChecDataCart")
const CheckCalendarType = document.getElementById("CheckCalendarType")
const CheckСensored = document.getElementById("CheckСensored")
const CheckRepeats_ = document.getElementById("CheckRepeats")
const CheckReleased_ = document.getElementById("CheckReleased")


// const getCoverURL = "http://107.173.19.4/cover.php?id="
// const getCoverURL = "//track-anime.dygdyg.ru/cover.php?id="
const getCoverURL = "https://" + MyServerURL + "/cover2.php?id="
// const getCoverURL = "https://shikimori.one/system/animes/original/"
var base_anime = {}
var anime_list_id = []
var covers_base = []



const nav_panel_buttons = document.querySelector('nav.navbar.navbar-expand-lg.bg-body-tertiary.sticky-top')




var URLKodikTranslations = "https://" + MyServerURL + "/kodik.php?method=translations&types=anime-serial"
var URLList = "https://" + MyServerURL + "/kodik.php?method=list&limit=100&with_material_data=true&camrip=false&types=anime,anime-serial"//&countries=Япония"
var URLCalendar = "https://" + MyServerURL + "/kodik.php?method=list&limit=100&with_material_data=true&camrip=false&anime_status=ongoing"//&anime_kind=tv"//&countries=Япония"
var URLListStart = "https://" + MyServerURL + "/kodik.php?method=list&limit=100&with_material_data=true&camrip=false&types=anime,anime-serial"
get_covers_base()

// Инициализация звёздного неба с пользовательскими параметрами
const starrySky = new StarrySky('starryCanvas', {
    rotationSpeed: 0.00005, // Очень медленное вращение
    maxOrbitRadius: window.innerWidth, // Радиус на ширину экрана
    starDensity: 0.0007, // Меньшая плотность звёзд
    fadeSpeed: 0.3, // Быстрее появление/исчезновение
    visibleAngleStart: Math.PI / 100, // ~1.8°
    visibleAngleEnd: 3 * Math.PI / 2, // 270°, почти до горизонта
    flickerSpeed: 0.005, // Скорость мерцания
    flickerIntensity: 0.4, // Интенсивность мерцания
    gradientColors: ['#1a1a1a', '#2a2a4a'], // Градиент: тёмный у горизонта, светлее кверху
    cloudConfig: {
        cloudCount: 10, // Количество облаков
        cloudSpeed: 0.2, // Скорость движения облаков
        cloudOpacity: 0.03, // Прозрачность облаков
        cloudBlur: 40 // Размытие облаков
    }
});
starrySky.stop()

setTimeout(() => {
    error_timeoud_hide = true  // Через 5 минут отключаем уведомление о блокировки сайта 
}, 5 * 60 * 1000);

//////// Создаёт функцию debug.log() /////////////////////////////////////////////

const debug = {
    log(...args) {
        if (isDebugEnabled) {
            // Захватываем стек вызовов
            const stack = new Error().stack;
            // Разбираем стек для получения информации о вызове
            const callerInfo = stack.split('\n')[2]; // Вторая строка обычно указывает на место вызова debug.log
            const match = callerInfo.match(/at\s+(.*)\s+\((.*):(\d+):(\d+)\)/) ||
                callerInfo.match(/at\s+(.*):(\d+):(\d+)/);

            let callerDetails = 'unknown';
            if (match) {
                var [, a, file, line, column] = match;
                callerDetails = `${file}:${line}`;
            }

            // Выводим с группировкой
            console.groupCollapsed(`[LOG]:`, ...args);
            console.trace(); // Для полного стека вызовов
            console.groupEnd();
        }
    }
};

isDebugEnabled = sh_api.url_get.searchParams.get('debug') ? sh_api.url_get.searchParams.get('debug') : isDebugEnabled
isDebugEnabled = sh_api.url_get.searchParams.get('Debug') ? sh_api.url_get.searchParams.get('Debug') : isDebugEnabled


///////////////////////////////////////////// Меняет иконку на локальном сайте ////////////////////////////

if (isLocal()) {
    document.getElementById("fav").href = "favicon_local.png"
    isDebugEnabled = true
    // document.getElementById("keepAwake").play()
} else {
    document.getElementById("fav").href = "favicon.png"
}

if (isDebugEnabled) document.getElementById("keepAwake").play()

///////////////////////////////////// Загружаются настройки из локалстораджа ///////////////////////////////
function Get_base_anime() {
    base_anime = localStorage.getItem('BaseAnime')
    if (base_anime) {
        base_anime = JSON.parse(base_anime)
    } else {
        base_anime = {}
    }
    if (base_anime.base) delete base_anime.base;
    if (base_anime.fav) delete base_anime.fav;
    base_anime.CalendarType = typeof base_anime.CalendarType == "boolean" ? base_anime.CalendarType : true  // Задаю календарь shikimori (по умолчанию включено)
    base_anime.censored = typeof base_anime.censored == "boolean" ? base_anime.censored : false             // Задаёт цензуру (по умолчанию выключено)
    base_anime.CheckRepeats = typeof base_anime.CheckRepeats == "boolean" ? base_anime.CheckRepeats : false // Задаёт скип повторов (по умолчанию выключено)
    base_anime.CheckReleased = typeof base_anime.CheckReleased == "boolean" ? base_anime.CheckReleased : false // Задаёт вывод только релизнутых аниме (по умолчанию выключено)
    base_anime.Fonts = base_anime.Fonts ? base_anime.Fonts : "Pangolin"                                // Загружаем шрифт по умолчанию

    base_anime.authorize = base_anime.authorize ? base_anime.authorize : false

    if (typeof base_anime.CalendarType == "boolean") {
        CheckCalendarType.checked = base_anime.CalendarType
    }
    if (typeof base_anime.censored == "boolean") {
        CheckСensored.checked = base_anime.censored
    }
    if (typeof base_anime.CheckRepeats == "boolean") {
        CheckRepeats_.checked = base_anime.CheckRepeats
    }
    if (typeof base_anime.CheckReleased == "boolean") {
        CheckReleased_.checked = base_anime.CheckReleased

    }
    FontsCustom(base_anime.Fonts)
}

Get_base_anime()

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// debug.log("translation", base_anime?.translation[0] == "string", base_anime?.translationActive[0] == "string")





///////////////////////////////////////////////////////////////////////////////////////////////////////////

var last_server_update = new Date().getTime() / 1000
///////////////////////////////////////// Кастыль на изменение гет параметров /////////////////////////////
setInterval(() => {
    if (document.getElementById("list_calendar").classList.contains('hide') && url_get.searchParams.get("calendar")) {
        url_get.searchParams.delete('calendar')
        window.history.pushState({}, '', url_get);
    };
    if (document.getElementById("list_fav").classList.contains('hide') && url_get.searchParams.get("sh_user_fav")) {
        url_get.searchParams.delete('sh_user_fav')
        window.history.pushState({}, '', url_get);
    };
    if (document.getElementById("list_resume").classList.contains('hide') && url_get.searchParams.get("resume")) {
        url_get.searchParams.delete('resume')
        window.history.pushState({}, '', url_get);
    };
    if (document.getElementById("DialogVideoInfo").classList.contains('d-none') && url_get.searchParams.get("shikimori_id")) {
        url_get.searchParams.delete('shikimori_id')
        window.history.pushState({}, '', url_get);
    };
    setIImgPreview()
    Get_base_anime()
    BaseAnimeCurrent = JSON.parse(localStorage.getItem('BaseAnimeCurrent')) || {};
    if (last_server_update < BaseAnimeCurrent.lasttime) {
        save_server_base() //Сохранение настроек на сервере
        last_server_update = BaseAnimeCurrent.lasttime
        debug.log("timeUpdate", BaseAnimeCurrent.lasttime)
    }
}, 1000);
///////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////// Костыль на вход в учётку /////////////////////////////////////////////
setTimeout(() => {
    if (base_anime.authorize == true && sh_api.authorize == false) {

    }

}, 10 * 1000);
////////////////////////////////////////////////////////////////////////////////////////////////////////////


check_ver()
async function check_ver() {
    var response = await fetch('vers.info');
    if (!response.status) return
    var text = await response.text()
    text = moment.utc(text, "YYYY-MM-DD HH:mm:ss").local().fromNow()
    debug.log(text)
    // document.querySelector('.ver_info').title = `build: ${text}`
    document.querySelector('.ver_info').title = `Последний сбой был ${text}, приятного вам дня!`
    console.log(
        `%cПоследний сбой был ${text}, приятного вам дня!`,
        "text-align: center; background-color: #666; border: 10px double black; border-radius: 15px; color: #5865f2; -webkit-text-stroke: 2px black; font-size: 64px; font-weight: bold;"
    );
}

async function get_covers_base() {
    try {
        const response = await fetch('covers.json');
        if (!response.ok) {
            throw new Error("!!!!!!!!!!!!!!!", `HTTP error! status: ${response.status}`);
        }
        // debug.log("covers_base",response.text());
        covers_base = await response.json();
        // debug.log("covers_base", covers_base);
        return covers_base;
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
    }
}

sh_api.get_user()
// sh_api.get_key()
let tmp_Clean_Cookie = false
if (!sh_api.getCookie("sh_refresh_token") && base_anime.authorize == true && !sh_api.getCookie("sh_refresh_token")) {
    base_anime.authorize = false;
    localStorage.setItem('BaseAnime', JSON.stringify(base_anime));
    save_server_base()
    debug.log("clear sh_refresh_token")
    tmp_Clean_Cookie = true
}

const voice = [
    {
        "id": 1978,
        "title": "Dream Cast",
        "type": "voice"
    },
    {
        "id": 557,
        "title": "JAM",
        "type": "voice"
    },
    {
        "id": 2023,
        "title": "РуАниме / DEEP",
        "type": "voice"
    },
    {
        "id": 923,
        "title": "AnimeVost",
        "type": "voice"
    },
    {
        "id": 610,
        "title": "AniLibria.TV",
        "type": "voice"
    },
    {
        "id": 767,
        "title": "SHIZA Project",
        "type": "voice"
    },
    {
        "id": 910,
        "title": "AniStar",
        "type": "voice"
    },
    {
        "id": 3293,
        "title": "VF-Studio",
        "type": "voice"
    },
    {
        "id": 2674,
        "title": "AniDub Online",
        "type": "voice"
    },
    {
        "id": 609,
        "title": "AniDUB",
        "type": "voice"
    },
    {
        "id": 704,
        "title": "Дублированный",
        "type": "voice"
    }
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
    "fandubbers": VideoInfo.querySelector("#info_fandubbers"),
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
    "AnilibriaPlayer": VideoInfo.querySelector("#info_AnilibriaPlayer"),
    "KodikPlayer": VideoInfo.querySelector("#info_KodikPlayer"),
    "duration": VideoInfo.querySelector("#info_duration"),
    "TorrentURL": null,


}

// list_serch.children[4].scrollIntoView({behavior: "smooth"}) чтоб перейти к нужному объекту на странице


document.addEventListener('DOMContentLoaded', function () {

    //////////////////////////////////////////////////////////// Проверка серий /////////////////////////////////////////////////////////
    setInterval(() => {

        url_get.searchParams.delete("code")
        window.history.pushState({}, '', url_get);
        if (!HistoryIsActivy || ld) return
        GetKodi("", true)
        // if(sh_api?.authorize==true) sh_api.get_user()
        sh_api?.authorize == true ? sh_api.get_user() : SetColorCartFav()
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



translation_id = ""

base_anime?.translationActive?.forEach(e => {
    if (!translation_id == "") translation_id = translation_id + ","
    translation_id = `${translation_id}${e.id}`
});
URLList = !translation_id == "" ? `${URLList}&translation_id=${translation_id}` : URLList

URLList = base_anime.CheckReleased == true ? `${URLList}&anime_status=released` : URLList

URLListStart = URLList  // Обновляем ссылку после пррименения гет запросов



load.show = (bool) => bool ? load.classList.remove("hide") : load.classList.add("hide")

ChecDataCart.addEventListener('change', function () {
    hide_date_cart(this.checked)
})
hide_date_cart()

CheckCalendarType.addEventListener('change', function () {
    base_anime.CalendarType = this.checked
    debug.log("CheckCalendarType", this.checked, base_anime.CalendarType)
    localStorage.setItem('BaseAnime', JSON.stringify(base_anime));
    save_server_base()
    if (url_get.searchParams.get("calendar")) addCalendar()
})
CheckСensored.addEventListener('change', function () {
    base_anime.censored = this.checked
    // debug.log("CheckCalendarType", this.checked, base_anime.CalendarType)
    localStorage.setItem('BaseAnime', JSON.stringify(base_anime));
    save_server_base()
})
CheckRepeats_.addEventListener('change', function () {
    base_anime.CheckRepeats = this.checked
    // debug.log("CheckCalendarType", this.checked, base_anime.CalendarType)
    localStorage.setItem('BaseAnime', JSON.stringify(base_anime));
    save_server_base()
    debug.log("CheckRepeats_", base_anime.CheckRepeats)
})
CheckReleased_.addEventListener('change', function () {
    base_anime.CheckReleased = this.checked
    // debug.log("CheckCalendarType", this.checked, base_anime.CalendarType)
    localStorage.setItem('BaseAnime', JSON.stringify(base_anime));
    save_server_base()
    debug.log("CheckReleased_", base_anime.CheckReleased)
    location.reload()
})

if (typeof base_anime.CalendarType == "boolean") {
    CheckCalendarType.checked = base_anime.CalendarType
}
if (typeof base_anime.censored == "boolean") {
    CheckСensored.checked = base_anime.censored
}
if (typeof base_anime.CheckRepeats == "boolean") {
    CheckRepeats_.checked = base_anime.CheckRepeats
}
if (typeof base_anime.CheckReleased == "boolean") {
    CheckReleased_.checked = base_anime.CheckReleased
}


url_get.searchParams.get('token') ? add_token_connect(url_get.searchParams.get('token')) : null

function add_token_connect(token) {
    document.cookie = `sh_refresh_token=${token.split(";")[0]}; path=/;`
    document.cookie = `sh_access_token=${token.split(";")[1]}; path=/; max-age=${token.split(";")[2]}`
    // document.cookie = `sh_access_token_max_age=${token.split(";")[2]}; path=/; max-age=${token.split(";")[2]};`
    document.cookie = `_kawai_session=""; path=/; max-age=-1;`

    url_get.searchParams.delete("token")
    window.history.pushState({}, '', url_get);
    // sh_api.refresh_token(token)
    location.reload()
}

function get_qr_code(text, el) {
    var qr = el ? el : document.querySelector("#qrcode_main div")
    qr.innerHTML = ""
    var qrcode = new QRCode(qr, {
        text: text,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.L
    });
    qrcode.makeCode(text);

    debug.log("QR Code", text)
    // sh_refresh_token
    // url_get.searchParams.set("token", `${UserID}`)
}
function hide_date_cart(tr) {
    document.head.appendChild(styleDateCart)
    if (typeof tr != "boolean") {
        ChecDataCart.checked = base_anime.hide_date_cart
        tr = base_anime.hide_date_cart
    }
    // debug.log(121, tr)

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
    save_server_base()
}

// function TorrentURL() {
//     window.open(`https://darklibria.it/search?find=${VideoInfo.info.TorrentPlayer.title}`)
// };

document.querySelector("#pipDialogButton").addEventListener('click', () => {
    ta_pip()
})




function setIImgPreview() {
    var img_preview = document.querySelectorAll(".img-preview")
    var preview = document.getElementById('image-preview-window');


    img_preview.forEach(e1 => {
        if (!e1.classList.contains("ipa")) {
            e1.addEventListener('mouseenter', function (e) {
                preview.src = e1.img_pre ? e1.img_pre : e1.src
                if (!e1.classList.contains("ipa-shift") || e.shiftKey) {
                    // preview.innerHTML = `<img src="${e1.src}" alt="Preview" >`;
                    preview.style.display = 'block';

                } else {
                    preview.style.display = 'none';
                }
                if (e1.getAttribute("img-preview-height")) {
                    preview.style.maxHeight = "auto"
                    preview.style.height = `${e1.getAttribute("img-preview-height")}`
                } else {
                    preview.style.maxHeight = "320px"
                    preview.style.height = "auto"
                }
                if (e.clientX < window.screen.availWidth / 2) {
                    preview.style.left = `${e.clientX + 10}px`;
                } else {
                    preview.style.left = `${e.clientX - preview.offsetWidth - 10}px`;
                }

                if (e.clientY < window.screen.availHeight / 2) {
                    preview.style.top = `${e.clientY + 10}px`;
                } else {
                    preview.style.top = `${e.clientY - 10 - preview.offsetHeight}px`;
                }
            });

            e1.addEventListener('mousemove', function (e) {
                if (preview.offsetWidth < 20) return
                if (!e1.classList.contains("ipa-shift") || e.shiftKey) {
                    preview.style.display = 'block';
                } else {
                    preview.style.display = 'none';
                }

                if (e1.getAttribute("img-preview-height")) {
                    preview.style.maxHeight = "auto"
                    preview.style.height = `${e1.getAttribute("img-preview-height")}`
                } else {
                    preview.style.maxHeight = "320px"
                    preview.style.height = "auto"
                }

                if (e.clientX < window.screen.availWidth / 2) {
                    preview.style.left = `${e.clientX + 10}px`;
                } else {
                    preview.style.left = `${e.clientX - preview.offsetWidth - 10}px`;
                }
                if (e.clientY < window.screen.availHeight / 2) {
                    preview.style.top = `${e.clientY + 10}px`;
                } else {
                    preview.style.top = `${e.clientY - 10 - preview.offsetHeight}px`;
                }

                // debug.log(e.clientY, preview.offsetWidth, window.screen.availWidth)
            });
            e1.addEventListener('mouseleave', function () {
                preview.style.display = 'none';
            });
            e1.classList.add("ipa")
        }
    });
}

function _CheckRepeats(id) {
    if (!base_anime.CheckRepeats) return false
    // debug.log("tttttt")
    if (!anime_list_id.includes(id)) {
        anime_list_id.push(id)
        return false
    } else {
        // debug.log(id)
        return true
    }
}

function setVideoInfo(e) {
    // debug.log(111, e)
    load.show(false)
    var html
    var tmp45353 = ""

    VideoInfo.e = e
    const tv = e.kind ? ` [${e.kind.toUpperCase()}]` : ""


    VideoInfo.info.cover.src = `cover.png`;
    VideoInfo.info.cover.src = `https://shikimori.one${e.image.original}`;
    debug.log(e.image.original)
    if (VideoInfo.info.cover.src.includes("missing_original.jpg")) {
        VideoInfo.info.cover.src = `${getCoverURL}${e.id}`
    } else {
        VideoInfo.info.cover.src = `${getCoverURL}${e.id}&url=${VideoInfo.info.cover.src}`
    }

    // VideoInfo.info.cover.src = `${getCoverURL}${e.id}`;
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
    // VideoInfo.info.info_status.href = e.status ? `${window.location.origin + window.location.pathname}?anime_status=${e.status ? e.status : "404.html"}` : "404.html";

    tmp45353 = ""

    e.studios.forEach(e1 => {
        debug.log(e1)
        tmp45353 = tmp45353 != "" ? tmp45353 + ", " : tmp45353
        tmp45353 = tmp45353 + `<a style="cursor: pointer;"class="link-danger link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"><img class="img-preview"style="height: 20px;" src="${e1.image ? `https://shikimori.one/${e1.image}` : ""}"> ${e1.name}</a>`
    });

    VideoInfo.info.studios.innerHTML = `<p class="card-text">Студии: ${tmp45353}</p>`

    // debug.log("studios",VideoInfo.e.studios.length)

    // VideoInfo.info.studios.textContent = e.studios[0]?.filtered_name ? e.studios[0].filtered_name : "?";
    // VideoInfo.info.studios.href = e.studios[0]?.filtered_name ? `${window.location.origin + window.location.pathname}?anime_studios=${e.studios[0].filtered_name ? e.studios[0].filtered_name : "404.html"}` : "404.html";

    tmp45353 = ""

    e.fandubbers.forEach(e1 => {
        tmp45353 = tmp45353 != "" ? tmp45353 + ", " : tmp45353
        tmp45353 = tmp45353 + `<a style="cursor: pointer;"class="link-danger link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">${e1}</a>`

    });

    VideoInfo.info.fandubbers.innerHTML = `<p class="card-text">Дабберы: ${tmp45353}</p>`
    VideoInfo.info.year.textContent = e.aired_on ? e.aired_on.split("-")[0] : "?";
    debug.log(e.aired_on, e.year, e.aired_on.split("-")[0])
    VideoInfo.info.year.href = e.aired_on.split("-")[0] ? `${window.location.origin + window.location.pathname}?year=${e.aired_on.split("-")[0] ? e.aired_on.split("-")[0] : "404.html"}` : "404.html";

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
        alert("Плеер больше недоступен")
        return
        let DialogVideoInfo = document.getElementById('DialogVideoInfo');
        DialogVideoInfo.classList.remove("DialogVideoInfoScroll");
        DialogVideoInfo.classList.remove("d-none");
        VideoPlayer.contentWindow.location.href = `/svetacdn.htm?menu_default=menu_button&shikimori=${e.id}&query=${e.russian.replace(/ /g, '+')}`
        debug.log(e.id)
        if (ev.shiftKey) {
            window.open(`/svetacdn.htm?menu_default=menu_button&shikimori=${e.id}&query=${e.russian.replace(/ /g, '+')}`, '_blank').focus();

            return

        } else {

        }
    })
    VideoInfo.info.AnilibriaPlayer.addEventListener('click', (ev) => {

        let DialogVideoInfo = document.getElementById('DialogVideoInfo');
        DialogVideoInfo.classList.remove("DialogVideoInfoScroll");
        DialogVideoInfo.classList.remove("d-none");
        VideoPlayer.contentWindow.location.href = `https://dygdyg.github.io/DygDygWEB/anilibria.htm?query=${e.russian.replace(/ /g, '+')}`
        debug.log(e.id)
        if (ev.shiftKey) {
            window.open(`https://dygdyg.github.io/DygDygWEB/anilibria.htm?query=${e.russian.replace(/ /g, '+')}`, '_blank').focus();

            return

        } else {

        }
    })



    // костыль пересоздаёт кнопку, чтобы очистить событие клика
    const newPlayer = VideoInfo.info.KodikPlayer.cloneNode(true);
    VideoInfo.info.KodikPlayer.parentNode.replaceChild(newPlayer, VideoInfo.info.KodikPlayer);
    VideoInfo.info.KodikPlayer = newPlayer;
    // ------------------------------------------
    VideoInfo.info.KodikPlayer.addEventListener('click', add_kodik_pleer)

    function add_kodik_pleer(ee) {
        if (ee.shiftKey) {
            window.open(`/kodik.htm?MyServerURL=${MyServerURL}&shikimori_id=${e.id}`, '_blank').focus();
        } else {
            VideoPlayer.contentWindow.location.href = `/kodik.htm?MyServerURL=${MyServerURL}&shikimori_id=${e.id}`;
            let DialogVideoInfo = document.getElementById('DialogVideoInfo');
            DialogVideoInfo.classList.remove("DialogVideoInfoScroll");
        }
    }

    VideoPlayer.contentWindow.location.href = `/kodik.htm?MyServerURL=${MyServerURL}&shikimori_id=${e.id}`;
    html = ""
    html2 = ""
    e.screenshots?.forEach(el => {
        html = html + `
        <div class="carousel-item w-100">
        <img src="https://shikimori.one${el.original}"
            class="d-block w-100"  
            alt="...">
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


    e.screenshots || e.screenshots ? VideoInfo.info.screenshots.parentNode.classList.remove("hide") : VideoInfo.info.screenshots.parentNode.classList.add("hide")
    // e.videos || e.videos ? VideoInfo.info.videos.parentNode.classList.remove("hide") : VideoInfo.info.videos.parentNode.classList.add("hide")
    VideoInfo.info.screenshots.innerHTML = html;
    // VideoInfo.info.videos.innerHTML = html2;
    VideoInfo.info.screenshots.querySelectorAll(".carousel-item")[0]?.classList.add("active");
    // VideoInfo.info.videos.querySelectorAll(".carousel-item")[0]?.classList.add("active");

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
                btn_sh_save.classList.add("yellow")
                btn_sh_save.classList.add("yellow_bg")
                btn_sh_save.classList.add("btn-primary")
                btn_sh_save.textContent = "смотрю"
                break;
            case "completed":
                btn_sh_save.classList.add("btn-success")
                btn_sh_save.textContent = "просмотренно"

                break;
            case "dropped":
                btn_sh_save.classList.add("btn-danger")
                btn_sh_save.textContent = "брошено"
                break;
            case "on_hold":
                btn_sh_save.classList.add("btn-warning")
                btn_sh_save.textContent = "отложено"
                break;
            case "planned":
                // btn_sh_save.classList.add("btn-secondary")
                btn_sh_save.classList.add("pink")
                btn_sh_save.classList.add("pink_bg")
                btn_sh_save.textContent = "запланировано"
                break;
            case "rewatching":
                btn_sh_save.classList.add("btn-info")
                btn_sh_save.textContent = "пересматриваю"
                break;
            default:
                btn_sh_save.classList.add("btn-outline-light")
                btn_sh_save.textContent = "Добавить"
                break;
        }
    } else {
        btn_sh_save.classList.add("hide")
    }

    setIImgPreview()
}

function vk_share() {

    var url = new URL("https://vk.com/share.php")
    url.searchParams.set("url", `https://track-anime.github.io/?shikimori_id=${AnimeInfo.id}`)
    url.searchParams.set("title", `Серии: ${VideoInfo.info.series.textContent} | [${AnimeInfo.kind ? AnimeInfo?.kind?.toUpperCase() : "?"}] ${AnimeInfo.russian}`)
    url.searchParams.set("image", `${VideoInfo.info.cover.src}`)
    url.searchParams.set("noparse", true)
    url.searchParams.set("description", "test123")
    debug.log(url)
    window.open(url, "shared")
    return url
    // document.querySelector("#copy_discord div a").click();
}

document.getElementById('User_Fav_sinc_button').addEventListener('mousedown', (e) => {

    switch (e.button) {
        case 0:
            GetFavBtn(sh_api.UserData.id)
            DialogVideoInfo.classList.add("d-none")
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
var timersearch
document.getElementById('search_input').addEventListener('input', function (e) {
    clearTimeout(timersearch)
    timersearch = setTimeout(() => {
        if (e.target.value == "") {
            url_get.searchParams.delete("seartch")
            window.history.pushState({}, '', url_get);
        }
        DialogVideoInfo.classList.add("d-none")

        GetKodi(encodeURI(e.target.value))
    }, 500);

})


document.getElementById("VideoInfoBtn").addEventListener('click', () => {
    let DialogVideoInfo = document.getElementById('DialogVideoInfo')
    DialogVideoInfo.classList.contains('DialogVideoInfoScroll') ? DialogVideoInfo.classList.remove("DialogVideoInfoScroll") : DialogVideoInfo.classList.add("DialogVideoInfoScroll")
    DialogVideoInfo.classList.contains('DialogVideoInfoScroll') ? starrySky.start() : starrySky.stop()

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
    save_server_base()
})



/////////////////////////////  После входа в учёту. Авторизация ///////////////////////////////
document.addEventListener("authorize", async function (e) { // (1)
    await load_server_base()

    var _raitnig_user = raitnig_user()
    debug.log(`Рейтинг пользователя: ${_raitnig_user}`)
    // url_get.searchParams.delete('code')
    window.history.pushState({}, '', url_get);
    SetColorCartFav()
    base_anime.authorize = sh_api.authorize;
    localStorage.setItem('BaseAnime', JSON.stringify(base_anime));
    save_server_base()

    document.getElementById("list_login_Button").classList.add('hide')

    document.getElementById("User_Menu_Button").classList.remove('hide')
    document.getElementById("User_Menu_Button").querySelector('img').src = sh_api.UserData.avatar
    document.getElementById("User_Menu_Button").querySelector('span').textContent = `${sh_api.UserData.nickname}: ⭐️${_raitnig_user}`
    document.getElementById("raiting_button").textContent = `Рейтинг: ⭐️${_raitnig_user}`
    document.getElementById("modal_reiting_info_title").textContent = `Ваш рейтинг пользователя на сайте: ⭐️${_raitnig_user}`
    document.getElementById("modal_reiting_info_body").textContent = `Он высчитывается на основе просмотренных, брошенных, отложенных, пересматриваемых и запланированных аниме, так же учитывается их дата выхода, количество серий и ещё многих других факторов.`
    document.getElementById("raiting_button")


    setTimeout(() => {
        return
        if (reiting_off) return
        reiting_off = true
        showToast({
            cover: sh_api.UserData.image.x160 ? sh_api.UserData.image.x160 : sh_api.UserData.avatar,
            title: "Он высчитывается на основе просмотренных, брошенных, отложенных, пересматриваемых и запланированных аниме, так же учитывается их дата выхода, количество серий и ещё многих других факторов.",
            date: {
                string: "",
            },
            voice: `Ваш рейтинг пользователя на сайте: ⭐️${_raitnig_user}`,
            sound_mute: true,
        }, 10, null, 3)
    }, 1 * 1000);

    const set2 = new Set(sh_api.Favorits.data.map(item => item.anime.id.toString()));

    GetFavoriteList("authorize")
    btn_sh_save?.classList.remove("hide")

    sh_api.UserData.raitnig_user = _raitnig_user
    sh_saveUserData(sh_api.UserData)

    if (!VideoInfo.e) return
    let tt = moment().add(moment.duration(VideoInfo.e.duration, 'minutes').asMilliseconds())
    debug.log("Статус", sh_api.Favorits.data.find(item => item.anime.id.toString() == VideoInfo.e.id)?.status)
    switch (sh_api.Favorits.data.find(item => item.anime.id.toString() == VideoInfo.e.id)?.status) {
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
function getCover(id) {

    if (covers_base[id] == undefined) {
        debug.log("getCover", id, `https://shikimori.one/animes/${id}`)
        sendWebhookMessageNoCover(id)
        return "404_static.png"
    }
    return covers_base[id]
}

async function sendWebhookMessageNoCover(id) {

    try {
        const response = await fetch("https://discord.com/api/webhooks/1301792415442538607/n_w6Dsl94EPDLgiFapybqFhG4RE2WU8lnUBPp7LhC5Q2jmSi-Np-unKT6lRpJ32mxqZF", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: sh_api.authorize ? sh_api.UserData.nickname : "нонейм",
                avatar_url: sh_api.authorize ? sh_api.UserData.image.x32 : "https://track-anime.github.io/favicon.png",

                content: `ID: ${id} \n https://shikimori.one/animes/${id}`,
            }),
        });

        if (!response.ok) {
            throw new Error(`Ошибка при отправке webhook: ${response.statusText}`);
        }

        debug.log('Сообщение успешно отправлено через webhook');
    } catch (error) {
        console.error('Ошибка при отправке webhook:', error);
    }
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


document.getElementById("list_calendar_Button").addEventListener('mousedown', async (e) => {

    switch (e.button) {
        case 0:
            window.getCalendar()
            DialogVideoInfo.classList.add("d-none")
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
            DialogVideoInfo.classList.add("d-none")
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


// VideoPlayerAnime.addEventListener("close", () => {
//     document.title = "Track Anime By ДугДуг"
// });

VideoPlayerAnime.addEventListener('hidden.bs.modal', e => {
    closeDialogButtonEvent()
    return
})

closeDialogButton.addEventListener('click', () => {
    closeDialogButtonEvent()
    return
});

function closeDialogButtonEvent() {
    starrySky.stop()
    // VideoPlayerAnime.modal.hide();
    DialogVideoInfo.classList.remove("DialogVideoInfoScroll")
    DialogVideoInfo.classList.add("d-none")
    document.getElementById("load").classList.add("hide")
    url_get.searchParams.delete("shikimori_id")
    url_get.searchParams.delete("id")

    window.history.pushState({}, '', url_get);
    VideoPlayer.contentWindow.location.href = "loading.htm";
    VideoInfo.info.cover.src = `cover.png`;


    document.title = "Track Anime By ДугДуг"
    SetColorCartFav()
}



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

        e = await httpGet(url_get.searchParams.get('shikimori_id') ?
            `https://shikimori.one/api/animes/${url_get.searchParams.get('shikimori_id')}` :
            `https://shikimori.one/api/animes/${url_get.searchParams.get('id')}`
        )
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
        dialog_(ed, true)
    }
}
// url_get.searchParams.delete("seartch")

async function getHome(iss) {
    debug.log("home")
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
    url_get.searchParams.set('calendar', true)
    window.history.pushState({}, '', url_get);
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

    document.getElementById("load").classList.remove("hide")
    document.getElementById('search_input').value = ""
    getChapter("#list_calendar")
    if (base_anime.CalendarType == true) {
        getCalendarSh()
        // document.getElementById("load").classList.add("hide")
        return
    }

    document.querySelectorAll(".ned_spoiler.nd .ned").forEach(e => {
        e.textContent = ""
        e.parentElement.open = false
    });

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
        //(e.type == 'anime-serial') &&
        if (e.translation.type == "voice" && e.shikimori_id && e.material_data.shikimori_rating > 0 && e.material_data.countries != "Китай") {  //&& (e.material_data.countries != "Китай"||CheckChinaTrash)  && (e.material_data.countries != "Китай"||document.getElementById("CheckChinaTrash"))
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
            // formatDate(e.material_data.next_episode_at).moment.day() == 0 ? d3[6].appendChild(cart) : d3[formatDate(e.material_data.next_episode_at).moment.day() - 1].appendChild(cart)
            d3[formatDate(e.material_data.next_episode_at).moment.isoWeekday() - 1].appendChild(cart)
        }
    });
    // formatDate().moment.isoWeekday()-1

    list_calendar.querySelectorAll('.ned_spoiler').forEach(e => {
        e.open = true
    });

    list_calendar.getElementsByClassName('ned_spoiler')[formatDate().moment.isoWeekday() - 1].open = true
    list_calendar.getElementsByClassName('ned_name')[formatDate().moment.isoWeekday() - 1].scrollIntoView({ behavior: "smooth", block: "start", inline: "start" })
    document.getElementById("load").classList.add("hide")
}


async function add_push(e) {
    if (sh_api?.authorize == false) return
    return

    const perm = await window?.Notification?.requestPermission()


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
    FavCheckSave = true
    debug.log(t)

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
            break;
        case 1:
            e1.textContent = "просмотренно"
            e1.classList.add("btn-success")
            break;
        case 2:
            e1.textContent = "брошено"
            e1.classList.add("btn-danger")
            break;
        case 3:
            e1.textContent = "отложено"
            e1.classList.add("btn-warning")
            break;
        case 4:
            e1.textContent = "запланировано"
            // e1.classList.add("btn-secondary")
            e1.classList.add("pink")
            e1.classList.add("pink_bg")
            break;
        case 5:
            e1.textContent = "пересматриваю"
            e1.classList.add("btn-info")
            break;
        default:
            e1.textContent = "Добавить"
            e1.classList.add("btn-outline-light")
            break;
    }
    setTimeout(() => {
        sh_api.AddUserRates(Number(e1.ids), t)
    }, 500);
}

function ClearFavorite() {
    // alert("restart")
    if (!confirm("Очистить локальную базу данных?")) return
    delete base_anime.fav
    localStorage.setItem('BaseAnime', JSON.stringify(base_anime));
    save_server_base()
    location.reload()
}


function ClearBase() {
    if (confirm("Очистить базу данных?")) {
        base_anime = {}
        localStorage.setItem('BaseAnime', JSON.stringify(base_anime));
        save_server_base()
        location.reload()
    }
}
document.querySelector('#ClearButtonMenu').addEventListener('click', () => {
    ClearBase()
})

if (base_anime?.translation) {
    if (typeof base_anime.translation[0] !== "string") {
        // ClearBase()
    }
}
if (base_anime?.translationActive) {
    if (typeof base_anime.translationActive[0] !== "string") {
        // ClearBase()
    }
}

/*     if (!base_anime?.translationActive || typeof base_anime.translationActive[0] !== "string") {
        base_anime.translationActive = [];
    } */

async function VoiceSettingsMenu() {
    /*     if (!base_anime?.translation || typeof base_anime.translation[0] !== "string") {
            base_anime.translation = [];
        }*/
    if (!base_anime?.translationActive) {
        debug.log(typeof base_anime?.translationActive, base_anime?.translationActive)
        if (!base_anime?.translationActive || typeof base_anime?.translationActive[0]?.title !== "string" || typeof base_anime?.translationActive == "undefined") {
            // debug.log(!base_anime?.translationActive, typeof base_anime?.translationActive[0]?.title !== "string", typeof base_anime?.translationActive == "undefined")

            base_anime.translationActive = [
                {
                    "id": 609,
                    "title": "AniDUB",
                    "type": "voice"
                },
                {
                    "id": 2674,
                    "title": "AniDub Online",
                    "type": "voice"
                },
                {
                    "id": 610,
                    "title": "AniLibria.TV",
                    "type": "voice"
                },
                {
                    "id": 923,
                    "title": "AnimeVost",
                    "type": "voice"
                },
                {
                    "id": 910,
                    "title": "AniStar",
                    "type": "voice"
                },
                {
                    "id": 1978,
                    "title": "Dream Cast",
                    "type": "voice"
                },
                {
                    "id": 557,
                    "title": "JAM",
                    "type": "voice"
                },
                {
                    "id": 3293,
                    "title": "VF-Studio",
                    "type": "voice"
                },
                {
                    "id": 704,
                    "title": "Дублированный",
                    "type": "voice"
                },
                {
                    "id": 3002,
                    "title": "Дублированный 18+",
                    "type": "voice"
                },
                {
                    "id": 2023,
                    "title": "РуАниме / DEEP",
                    "type": "voice"
                },
                {
                    "id": 3717,
                    "title": "РуАниме / DEEP 18+",
                    "type": "voice"
                }
            ];
            localStorage.setItem('BaseAnime', JSON.stringify(base_anime));
            save_server_base()
        }
    }
    VoiceSettings.innerHTML = ""
    const checkboxList = document.getElementById('checkbox-list');
    const buttonContainer = document.getElementById('button-container');
    debug.log(base_anime.translation)
    tr_list = await httpGet(URLKodikTranslations)
    debug.log(tr_list, tr_list["results"])
    tr_list = tr_list["results"]
    base_anime.translation = tr_list;
    localStorage.setItem('BaseAnime', JSON.stringify(base_anime));
    save_server_base()
    base_anime.translation.sort().forEach((voice, index) => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `voice-${index}`;
        checkbox.classList.add("form-check-input");
        checkbox.classList.add("voice_name_check");

        // checkbox.checked = base_anime.translationActive.includes(voice.title);
        checkbox.checked = base_anime.translationActive.some(item => item.title === voice.title);

        const checkboxLabel = document.createElement('label');
        checkboxLabel.htmlFor = `voice-${index}`;
        checkboxLabel.className = 'form-check-label';
        checkboxLabel.textContent = voice.title;
        checkboxLabel.classList.add(encodeURIComponent(voice.title));

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
        const checkboxes = document.querySelectorAll('.voice_name_check');

        checkboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                // base_anime.translationActive.push(checkbox.nextElementSibling.textContent);
                if (base_anime.translation.find(item => item.title == checkbox.nextElementSibling.textContent)) base_anime.translationActive.push(base_anime.translation.find(item => item.title == checkbox.nextElementSibling.textContent));
            }
        });
        if (base_anime.translationActive.length > 0) localStorage.setItem('BaseAnime', JSON.stringify(base_anime));
        save_server_base()
        // VoiceSettings.innerHTML = ""
        VoiceSettings.modal.hide()
        location.reload();
    });

    VoiceSettings.modal.show()

}
async function httpGet(theUrl) {
    try {
        const response = await fetch(theUrl);
        // debug.log('Код выполнения:', response.status); // Например, 200
        // debug.log('Текст статуса:', response.statusText); // Например, "OK"

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText}`);
        }
        const data = await response.json(); // Парсинг ответа, если ожидается JSON
        debug.log('Данные:', data);
        return data
    } catch (error) {
        const url = new URL(theUrl)
        debug.log(url)
        console.error('Ошибка:', error.message);
        if (error_timeoud_hide == true) return
        showToast({
            cover: "rkn.png",
            title: `Скорей всего сайт заблокирован в Вашем регионе, для подробностей пишите мне в discord или telegram. Кликни для контактов.`,
            date: {
                string: "",
            },
            voice: `Ошибка доступа к ${url.hostname}`,
        }, "15", "/contact.htm")
        document.getElementById("contacts_Button").classList.remove('hide')
        // prompt(`Ошибка: ${error.message}. Скорей всего сайт заблокирован в Вашем регионе, для подробностей пишите мне в discord или telegram`, ".dygdyg @DygDyg")
    }
    const data = await response.json();
    return data
}



async function getCalendarSh() {
    document.getElementById("load").classList.remove("hide")
    var tmp_ned = document.querySelectorAll(".ned_spoiler.nd .ned")
    tmp_ned.forEach(e => {
        e.textContent = ""
        e.parentElement.open = false
    });
    // const ned_shikimori = document.querySelector(".ned_shikimori")
    // ned_shikimori.textContent = ""
    // ned_shikimori.classList.add("ned_shikimori")

    // var response = await fetch(`https://shikimori.one/api/calendar?censored=${base_anime.censored ? base_anime.censored : false}${sh_api.getCookie("sh_access_token") ? "&access_token="+sh_api.getCookie("sh_access_token"):""}`);  //sh_access_token
    var response = await fetch(`https://${MyServerURL}/kodik.php?method=calendar`);
    const data = await response.json();
    // debug.log("dasdasdasdasd", data)
    data.forEach(e => {
        // Скрывает анонсы (ещё не вышедшие аниме) anons
        // if(e.anime.status=="anons") return    

        const e1 = {
            "title": `${e.anime.russian}`,
            "cover": `https://shikimori.one${e.anime.image.original}`,
            // "cover": `https://shikimori.one${base_anime.base[e.shikimori_id].image.original}`,
            "date": formatDate(e.next_episode_at),
            "voice": formatDate(e.next_episode_at).moment.format('dddd'),
            "series": e.next_episode ? e.next_episode : "M",

            "link": `https://shikimori.one/animes/${e.anime.id}`,
            "kp": null,
            "imdb": null,
            "shikimori": e.anime.id,
            "status": e.status,
            "raiting": e.score,
            "material_data": null,
            "id": e.anime.id,
            "screenshots": [],
            "e": e,
        }
        debug.log(e.anime.russian, e1)

        tmp_ned[formatDate(e.next_episode_at).moment.isoWeekday() - 1].appendChild(add_cart(e1))
        // ned_shikimori.appendChild(add_cart(e1))
    });
    // debug.log(data)
    // tmp_ned[formatDate().moment.isoWeekday()-1].parentElement.open = true
    tmp_ned.forEach(e => {
        e.parentElement.open = true
    });
    tmp_ned[formatDate().moment.isoWeekday() - 1].parentElement.scrollIntoView({ behavior: "smooth", block: "start", inline: "start" })
    document.getElementById("load").classList.add("hide")
}
/* const e1 = {
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
 document.querySelector(".getcalendar")
 */
// ned_shikimori
// return data




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
        // debug.log(e?.data?.status=="anons")
        (e.r < r.target.value && e?.data?.status != "anons") ? e.classList.add('hide') : e.classList.remove('hide')

    })
}
async function SetColorCartFav() {
    document.querySelectorAll(".cart_").forEach(e => {
        if (e?.data?.shikimori == undefined) return
        if (sh_api.authorize == true) {
            e.style.borderTopColor = sh_api.status_color[sh_api?.Favorits?.data?.find(item => item.anime.id.toString() === e?.data?.shikimori.toString())?.status]?.[0] ? sh_api.status_color[sh_api?.Favorits?.data?.find(item => item.anime.id.toString() === e?.data?.shikimori.toString())?.status]?.[0] : "none"
        }
    });
}
// JavaScript
/* document.addEventListener('mousemove', (e) => {
    const { innerWidth: width, innerHeight: height } = window;
    const { clientX: mouseX, clientY: mouseY } = e;

    const moveX = ((mouseX / width) * 10) - 5;
    const moveY = ((mouseY / height) * 10) - 5;

    const elements = document.querySelectorAll('.paralax-bg');

    elements.forEach((element) => {
        element.style.backgroundPosition = `${50 + moveX}% ${50 + moveY}%`;
    });
}); */



function add_cart(e) {
    const cart = document.createElement('div');
    cart.data = e;
    // debug.log(cart.data.shikimori)
    cart.classList.add('cart_', 'bg-dark', 'text-white');
    cart.classList.add("hand-drawn-border_hover")
    cart.setAttribute('tabindex', '0');
    cart.r = e.raiting
    cart.title = e?.status
    // debug.log("test",e)
    document.body.r > cart.r && e?.status != "anons" ? cart.classList.add('hide') : null;
    // cart.style.borderBottomStyle = "dashed"
    cart.style.borderBottomStyle = "dotted"
    switch (e.status) {
        case "anons":
            cart.style.borderBottomColor = "#cc00cc"
            break;
        case "ongoing":
            cart.style.borderBottomColor = "#52af00"
            // 
            break;
        case "released":
            // cart.style.borderBottomColor = "#00b5f8"
            break;

        default:
            break;
    }

    // cart.addEventListener("mousemove", fCardRotate);
    // cart.addEventListener("mouseout", fCardDefault);

    const target = document.createElement('div');
    target.classList.add('cart-target');
    cart.appendChild(target);
    // if (e.cover.includes("missing_original.jpg")) e.cover = `${getCoverURL}${e.shikimori}`

    if (e.cover?.includes("missing_original.jpg")) {

        e.cover = `${getCoverURL}${e.shikimori}`

        // e.cover = `https://shikimori.one/system/animes/original/${e.shikimori}.jpg`
    } else {
        if (!e.cover?.startsWith('http')) e.cover = "https://shikimori.one" + e.cover
        // debug.log(e.cover)
        e.cover = `${getCoverURL}${e.shikimori}&url=${e.cover}`
        // e.cover = `${getCoverURL}${e.shikimori}`
    }
    // e.cover = `${getCoverURL}${e.shikimori}`


    const imgTop = document.createElement('div');
    imgTop.style.backgroundImage = `url(${e.cover}),  url(404.jpg)`;

    imgTop.src = e.cover;
    imgTop.classList.add('cart-img-top');
    // imgTop.classList.add('img-preview');
    imgTop.classList.add('ipa-shift');
    imgTop.classList.add('paralax-bg');
    imgTop.setAttribute("img-preview-height", "720px")
    imgTop.img_pre = e.cover
    imgTop.alt = 'cover';


    cart.appendChild(imgTop);

    imgTop.addEventListener("mousedown", (event) => {
        var a = new URL(window.location.href)
        a.searchParams.set("shikimori_id", `${e.shikimori}`)
        // debug.log(event.button, a.href)
        // return
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
    cartTitle.textContent = `${e.title}`;
    cartTitle.title = e.title;
    imgTop.appendChild(cartTitle);


    const cartBG = document.createElement('div');
    cartBG.classList.add('cart-BG');
    cartBG.innerHTML = `<span style="font-size: 20px;text-align: center;display: block;">${e.title}</span><hr style="margin: 6px 0 6px 0;">
    ${e.e.material_data ? "" : "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>"}
    Серии: ${e.e.material_data ? (e?.e?.material_data?.episodes_aired) : "?"}/${e.e.material_data ? (e?.e?.material_data?.episodes_total) : "?"}<br>
    Рейтинг: ${e.e.material_data ? (e?.e?.material_data?.rating_mpaa) : "?"}<br>
    Статус: ${e.e.material_data ? (e?.e?.material_data?.anime_status) : "?"}<br>
    Жанры: ${e?.e?.material_data?.anime_genres?.map(genre => genre)?.join(', ') ?? "?"}<br>
    
    <br>${e?.e?.material_data?.anime_description ? e?.e?.material_data?.anime_description : ""}<br>
    `;
    // cartBG.title = e.title;
    imgTop.appendChild(cartBG);


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
    !e.raiting ? cartRaiting.classList.add("hide") : null
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

    var id = e.shikimori ? e.shikimori : e.id
    if (sh_api.authorize == true) {
        cart.style.borderTopColor = sh_api.status_color[sh_api?.Favorits?.data?.find(item => item.anime.id.toString() === id.toString())?.status]?.[0] ? sh_api.status_color[sh_api?.Favorits?.data?.find(item => item.anime.id.toString() === id.toString())?.status]?.[0] : "none"
    }
    return cart
}
var hide_date_cart_num = 0
function add_card_ned(e) {


    const cart = document.createElement('div');
    cart.classList.add("cart_")

    // cart.classList.add("bg-dark")
    cart.classList.add("cart_n_bg")
    // ${e.cart_data_old.n == "сб" || e.cart_data_old.n == "вс" ? "#ff00002e" : "#1900ff2e"}
    cart.innerHTML = `
    <div class="cart_n">
        <div align="center" class="hand-drawn-border" style=" font-size: 3em;wight=50%;width: 50%;height: 100%;background-color:#5151518f;border-color: #dee2e6;border-style: solid;border-width: 0.3rem;border-radius: 5px 0px 0px 5px;">
            <div align="center" style=";height: 25%;background-color: ${e.cart_data_old.nn > 0 ? `hwb(${190 / 7 * e.cart_data_old.nn + 190}deg 0% 0% / 18.04%);` : "hwb(0deg 0% 0% / 18.04%)"}">${e.cart_data_old.n}</div>
        ${e.cart_data_old.dat}<br class="br">◄</div>
        <div align="center" class="hand-drawn-border" style="font-size: 3em;wight=50%;width: 50%;height: 100%;background-color:#5151518f;border-color: #dee2e6;border-style: solid;border-width: 0.3rem;border-radius: 0px 5px 5px 0px;">
            <div align="center" style=";height: 25%;background-color: ${e.cart_data_new.nn > 0 ? `hwb(${190 / 7 * e.cart_data_new.nn + 190}deg 0% 0% / 18.04%);` : "hwb(0deg 0% 0% / 18.04%)"}">${e.cart_data_new.n}</div>
        ${e.cart_data_new.dat}<br class="br">►</div>
    </div>
    `
    if (hide_date_cart_num < 15) {
        hide_date_cart_num = hide_date_cart_num + 1
    } else {
        // debug.log(hide_date_cart_num)
        cart.setAttribute("style", "display: none !important;");
    }
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
function playSound(soundFile, vol) {
    var audioElement = new Audio(soundFile);
    audioElement.preload = 'auto';
    audioElement.volume = vol ? vol : (base_anime.Volume ? base_anime.Volume : 1.0);
    audioElement.play();
    // debug.log(audioElement.volume)
}


// Отправляет всплывающий алерт, всплывающее сообщение. (alert popup tooltips)
function showToast(e, t, click, t_start) {

    // prompt("",JSON.stringify(e))
    debug.log(e)
    if (!e.sound_mute) playSound('meloboom.mp3');
    var toast0 = document.createElement('div');
    document.getElementById('ToastsMain').appendChild(toast0)

    toast0.innerHTML = `
    <div class="toast liveToast" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false" style="user-select: none;">
    <div class="toast-header">
      <img src="${e.cover}" style="height: 75px;" class="imgs rounded me-2" alt="...">
      <strong class="${encodeURIComponent(e.voice)} me-auto">${e.voice}</strong>
      <small class="text-muted">${e.date.string}</small>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Закрыть"></button>
    </div>
    <div class="toast-body">
      ${e.title}
    </div>
  </div>
    `;
    if (e.cover != 'discord_logo.png') toast0.querySelector("img").classList.add("img-preview")
    t_start = t_start ? t_start : 0
    setTimeout(() => {
        var toast1 = new bootstrap.Toast(toast0.querySelector(".liveToast"));
        // debug.log(typeof t)
        if (typeof t == "number") setTimeout(() => toast0.remove(), t * 1000);

        toast0.addEventListener('hidden.bs.toast', function (e) {
            toast0.remove()
        })
        toast1.show();

        toast0.querySelector(".toast.liveToast.fade.show").addEventListener("click", (ev) => {

            if (click && ev.delegateTarget == undefined && ev.delegateTarget == null) {
                window.open(click, '_blank');
            } else {
                toast1.hide();
            }
        })

        setTimeout(() => {
            // toast1.hide();
        }, 60 + 60 + 1000);

        // toast0.show();
        // toast.dispose()
    }, t_start * 1000)
}
document.addEventListener("sh_get_anime", function (e) {
    debug.log("sh_get_anime", e.anime)
    AnimeInfo = e.anime
    // debug.log(`https://shikimori.one${e.anime.image.original}`)
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



function copy_discord() {
    var screen = ""
    AnimeInfo.screenshots?.forEach((el, i) => {
        screen = screen + ` [scr${i + 1}](https://shikimori.one${el.original})`
    })
    screen = ""
    var genres = ""

    AnimeInfo.genres.forEach(e => {
        genres = `${genres} [${e.russian}](<https://track-anime.github.io/?anime_genres=${e.russian}>)`
    });

    copyToClipboard(`
~~                                                                                                                                                                                          ~~
#  [${AnimeInfo.kind ? AnimeInfo?.kind?.toUpperCase() : "?"}] ${AnimeInfo.russian} 
[${VideoInfo.info.updated_at.textContent}]

> 🎬 **Серии:** ${VideoInfo.info.series.textContent}  
> ⏰ **Длительность:** ${VideoInfo.info.duration.textContent}
> 🎨 **Студия:** [${VideoInfo.info.studios.textContent}](<https://track-anime.github.io/?anime_studios=${encodeURIComponent(VideoInfo.info.studios.textContent)}>) 
> 📅 **Год выхода:** ${VideoInfo.info.year.textContent}
> 🏷️ **Жанры:** ${genres} 
> 📌 **Статус:** ${VideoInfo.info.info_status.textContent}  
> 🎯 **Возрастной рейтинг:** [${VideoInfo.info.rating_mpaa.textContent}](<https://track-anime.github.io/?rating_mpaa=${encodeURIComponent(VideoInfo.info.rating_mpaa.textContent)}>)
> 🌟 **Рейтинг shikimori:** ${VideoInfo.info.shikimori_rating.textContent}

[Открыть на Track Anime By ДугДуг](<https://track-anime.github.io/?shikimori_id=${AnimeInfo.id}>)
[Открыть на shikimori](<https://shikimori.one/animes/${AnimeInfo.id}>)

[Обложка](${VideoInfo.info.cover.src})
    `)
    // playSound("ok.mp3")
    showToast({
        cover: "discord_logo.png",
        title: "Описание скопировано в буфер обмена в формате discord",
        date: {
            string: "",
        },
        voice: "Описание скопировано",
    }, 5)
}

function copy_telegram() {
    var screen = ""
    AnimeInfo.screenshots?.forEach((el, i) => {
        screen = screen + ` [scr${i + 1}](https://shikimori.one${el.original})`
    })
    screen = ""
    var genres = ""

    AnimeInfo.genres.forEach(e => {
        genres = `${genres} ${e.russian}`
    });
    // _______________________________________________________________
    // \`\`\`${AnimeInfo.description}\`\`\`
    copyToClipboard(`

**[${AnimeInfo.kind ? AnimeInfo?.kind?.toUpperCase() : "?"}]**  \`${AnimeInfo.russian}\`
        [__${VideoInfo.info.updated_at.textContent}__]

||🖼️ [Обложка] ${VideoInfo.info.cover.src}||

    | 🎬 **Серии:** __${VideoInfo.info.series.textContent}__
    | ⏱ **Длительность:** __${VideoInfo.info.duration.textContent}__
    | 🎨 **${VideoInfo.info.studios.textContent}**
    | 📅 **Год выхода:** __${VideoInfo.info.year.textContent}__
    | 🏷️ **Жанры:** __${genres}__ 
    | 📌 **Статус:** __${VideoInfo.info.info_status.textContent}__ 
    | 🎯 **Возрастной рейтинг:** __${VideoInfo.info.rating_mpaa.textContent}__
    | 🌟 **Рейтинг shikimori:** __${VideoInfo.info.shikimori_rating.textContent}__

🔗 [Track Anime By ДугДуг]: https://track-anime.github.io/?shikimori_id=${AnimeInfo.id}
🌐 [shikimori]: https://shikimori.one/animes/${AnimeInfo.id}

__${AnimeInfo.description ? AnimeInfo.description.replace(/\[character=\d+\]/g, '__ **').replace(/\[\/character\]/g, '** __') : '*'}__

    `)
    // playSound("ok.mp3")
    showToast({
        cover: "telegram_logo.png",
        title: "Описание скопировано в буфер обмена в формате telegram",
        date: {
            string: "",
        },
        voice: "Описание скопировано",
    }, 5)
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        debug.log('Текст успешно скопирован в буфер обмена', text);
    }).catch(err => {
        console.error('Не удалось скопировать текст: ', err);
    });
}

function dialog_(e, info) {
    VideoPlayerAnime.pip = VideoPlayerAnime.pip ? VideoPlayerAnime.pip : false
    if (e.shift) {
        // if (confirm(`Открыть "${e.title}" в отдельном окне?`)) {
        let DialogVideoInfo = document.getElementById('DialogVideoInfo');
        DialogVideoInfo.classList.remove("DialogVideoInfoScroll");
        VideoPlayer.contentWindow.location.href = `https://kodik.cc/find-player?shikimoriID=${e.shikimori}`;
        DialogVideoInfo.classList.remove("d-none");
        // window.open(`/svetacdn.htm?loadserv=kodik&shikimoriID=${e.shikimori}`, '_blank').focus();
        // };
        return
    }
    Loading_skip.addEventListener('click', function (event) {
        debug.log("skip..")
        let DialogVideoInfo = document.getElementById('DialogVideoInfo');
        DialogVideoInfo.classList.remove("DialogVideoInfoScroll");
        VideoPlayer.contentWindow.location.href = `https://kodik.cc/find-player?shikimoriID=${e.shikimori}`;
        DialogVideoInfo.classList.remove("d-none");
        load.show(false)
    })
    // debug.log(e.shikimori, info)
    sh_api.get_anime(e.shikimori)
    load.show(true)
    Loading_skip.classList.add("hide")

    setTimeout(() => {
        Loading_skip.classList.remove("hide")
    }, 5000);
    // setVideoInfo(e)
    url_get.searchParams.set("shikimori_id", `${e.shikimori}`)
    window.history.pushState({}, '', url_get);
    document.title = `TA: ${e.title}`
    DialogVideoInfo.classList.remove("d-none")


    // VideoPlayerAnime.modal.show();

    // if ((e.imdb || e.kp) && e.shift) {
    //     VideoPlayer.contentWindow.location.href = e.kp ? `//dygdyg.github.io/DygDygWEB/svetacdn.htm?loadserv=kinobox&kinopoiskID=${e.kp}` : `//dygdyg.github.io/DygDygWEB/svetacdn.htm?loadserv=kinobox&imdb=${e.imdb}`
    //     return
    // }

    // VideoPlayer.contentWindow.location.href = e.link?e.link:"loading.htm"
    debug.log(e.link)
    info ? DialogVideoInfo.classList.add("DialogVideoInfoScroll") : DialogVideoInfo.classList.remove("DialogVideoInfoScroll")
    info ? starrySky.start() : starrySky.stop()

    ta_pip(false)
}

document.getElementById("RangeVolume").value = base_anime.Volume ? base_anime.Volume : 1.0
document.getElementById("RangeVolume").addEventListener("change", (e) => {
    var a_f = ["ok.mp3", "meloboom.mp3"]
    // debug.log(e.target.value, getRandomInt(2))
    base_anime.Volume = e.target.value
    localStorage.setItem('BaseAnime', JSON.stringify(base_anime));
    save_server_base()
    playSound(a_f[getRandomInt(2)], base_anime.Volume ? base_anime.Volume : 1.0)
})

// RangeRaitingObj.addEventListener("input", RangeRaiting);
// RangeRaitingObj.addEventListener("change", () => { GetKodi() });

function ta_pip(flag) //picture to picture
{
    if (typeof flag != "boolean" && typeof flag != "undefined") return debug.log("Ну и что это такое?")
    VideoPlayerAnime.pip = typeof flag == "boolean" ? flag : !VideoPlayerAnime.pip

    if (VideoPlayerAnime.pip == true) {
        // VideoPlayerAnime.pip = true
        document.querySelector("#VideoPlayerAnime").classList.add("ta_modal")
        document.querySelector("#VideoPlayerAnime").classList.remove("modal")
        document.querySelector(".modal-backdrop").classList.add("ta_modal-backdrop_hide")
        // document.querySelector("#DialogVideoInfo").classList.remove("DialogVideoInfoScroll")
    }
    if (VideoPlayerAnime.pip == false) {
        // VideoPlayerAnime.pip = false
        document.querySelector("#VideoPlayerAnime").classList.remove("ta_modal")
        document.querySelector("#VideoPlayerAnime").classList.add("modal")
        // document.querySelector(".modal-backdrop").classList.remove("ta_modal-backdrop_hide")
        // document.querySelector("#DialogVideoInfo").classList.add("DialogVideoInfoScroll")
    }
    return VideoPlayerAnime.pip
}



function VoiceTranslate(name) {
    if (ignoreVoice || base_anime.translationActive < 1) return true
    if (base_anime.translationActive) {
        // return base_anime.translationActive.includes(name)
        return base_anime.translationActive.some(item => item.title === name);
    } else {
        if (!base_anime) base_anime = {}
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
    sh_api.search(search, base_anime.censored ? base_anime.censored : false)
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
                if (typeof (URLList) != "string") {
                    debug.log("конец истории");
                    if (!document.querySelector(".cart_end")) {
                        document.getElementById("list_serch").insertAdjacentHTML('beforeend', `<div class="cart_ cart_end">
                            <div class="cart_n">
                                <div align="center" style=" font-size: 3em;wight=50%;width: 50%;height: 100%;background-color:#5151518f;border-color: #dee2e6;border-style: solid;border-width: 0.3rem;border-radius: 5px 0px 0px 5px;">
                                    <div align="center" style="height: 25%;background-color: hwb(230.37deg 0% 0% / 18.04%);">ALL
                            </div><br class="br">◄</div>
                                <div align="center" style="font-size: 3em;wight=50%;width: 50%;height: 100%;background-color:#5151518f;border-color: #dee2e6;border-style: solid;border-width: 0.3rem;border-radius: 0px 5px 5px 0px;">
                                    <div align="center" style="height: 25%;background-color: hwb(298.57deg 42.09% 49.46% / 18.04%);">END</div><br class="br">X</div>
                            </div>
                            </div>`)
                    }
                    return;
                }
                dat = await httpGet(URLList)
                URLList = dat.next_page
                endid = endid ? endid : dat.results[0].id

            }
            debug.log(dat)
        } else {

            getHome(true)
            HistoryIsActivy = false
            ignoreVoice = true
            document.getElementById('search_input').value = decodeURIComponent(seartch)
            targetFrame = document.getElementById('list_history')
            getChapter("#list_history")
            targetFrame.innerHTML = ""
            // dat1 = await httpGet(`${URLSearch}${seartch}`)
            dat = {}

            /* dat.results = dat1.results.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.shikimori_id === value.shikimori_id
                ))
            ); */

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

if (url_get.searchParams.get('calendar')) {  // Открываем календарь, если есть гет параметр
    getCalendar()
    HistoryIsActivy = false
} else if (url_get.searchParams.get('sh_user_fav')) {
    GetFavUsersList(url_get.searchParams.get('sh_user_fav'))

} else {
    GetKodi(url_get.searchParams.get('seartch'))
}




function GetKodiScan(data, revers) {

    var t1 = false
    data.forEach((e, i) => {
        if (revers && endid == e.id || t1) {

            t1 = true
            endid = endid2
            return
        }
        //(e.type == 'anime-serial' || e.type == "anime") &&
        if (e.translation.type == "voice" && e.shikimori_id) {  //&& e.material_data.countries != "Китай" //&& e.material_data.shikimori_rating > 0
            if (_CheckRepeats(e.shikimori_id)) {//&& (BaseAnimeCurrent[e.shikimori_id]?.episode <= e.last_episode)) {
                // debug.log("Hides Repeats")
                return
            }
            if (VoiceTranslate(e.translation.title)) {

                if (!e.shikimori_id) return
                const e1 = {
                    "title": e?.material_data?.anime_title ? e?.material_data?.anime_title : "404",
                    "cover": e?.material_data?.poster_url ? e?.material_data?.poster_url : "404.jpg",
                    // "cover": `https://shikimori.one${base_anime.base[e.shikimori_id].image.original}`,
                    "date": formatDate(e.updated_at),
                    // "date": formatDate(base_anime.base[e.shikimori_id].next_episode_at),
                    "voice": e.translation.title,
                    "series": e.episodes_count ? e.episodes_count : "M",
                    "link": e.link,
                    "kp": e.kinopoisk_id,
                    "imdb": e.imdb_id,
                    "shikimori": e.shikimori_id,
                    "status": e?.material_data?.all_status,
                    "raiting": e?.material_data?.shikimori_rating,
                    "material_data": e.material_data,
                    "id": e.id,
                    "screenshots": e.screenshots,
                    "e": e,

                }

                const cart = add_cart(e1)
                cart_list.push(cart)
                // if(i==0) cart.focus();
                // cart.style.borderBottomStyle = "dashed"
                cart.style.borderBottomStyle = "dotted"


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
                    if (BaseAnimeCurrent[e.shikimori_id]?.episode < e.last_episode) {
                        new_anime_list.appendChild(cart)
                    }
                    list_serch.prepend(new_anime_list)
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

            if (typeof base_anime.translation[0] == "string") base_anime.translation = []
            if (typeof base_anime.translationActive[0] == "string") base_anime.translationActive = []
            if (!base_anime.translation.some(item => item.title === e.translation.title) && e.type.includes("anime")) base_anime.translation.push(e.translation);

        }

    });
}
localStorage.setItem('BaseAnime', JSON.stringify(base_anime));
save_server_base()

///////////////////////////////////////////
var htmlscanner
var qrcode_scan_modal = new bootstrap.Modal(document.getElementById("qrcode_scan_modal"))



document.getElementById("qrcode_scan_modal").addEventListener('hidden.bs.modal', function (e) {
    htmlscanner.clear()
    // debug.log(111)
})

function domReady(fn) {
    if (
        document.readyState === "complete" ||
        document.readyState === "interactive"
    ) {
        setTimeout(fn, 1000);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}


/////////////////////////////////////////////////////// История просмотренных аниме ////////////////////////////////////////////////////////////////////////
const resume_Button = document.getElementById("resume_Button")
if (isDebugEnabled) resume_Button.classList.remove("hide")




async function GetResume() {
    load.show(true)
    HistoryIsActivy = false
    url_get.searchParams.set('resume', true)
    window.history.pushState({}, '', url_get);
    document.querySelectorAll(".anime_list").forEach(e => {
        e.classList.add("hide")
    });
    document.querySelector(".navbar-nav").querySelectorAll("button").forEach(e => {

        e.classList.remove("active")
    })
    resume_Button.classList.add("active")
    list_resume.innerHTML = ""
    list_resume.classList.remove("hide")
    for (let key in BaseAnimeCurrent) {

        if (key != "lasttime") {
            // console.log(BaseAnimeCurrent[key]["lasttime"])
            BaseAnimeCurrent[key]["lasttime"] = BaseAnimeCurrent[key]["lasttime"] == undefined ? BaseAnimeCurrent[key]["lasttime"] : new Date().getTime() / 1000
            // BaseAnimeCurrent[key][""]
            const e1 = {
                "title": BaseAnimeCurrent[key]?.material_data?.anime_title ? (BaseAnimeCurrent[key]?.material_data?.anime_title) : "?",
                // "cover": e.image.original,
                "cover": BaseAnimeCurrent[key]?.material_data?.anime_poster_url,
                "date": formatDate(new Date(BaseAnimeCurrent[key]?.lasttime * 1000)),
                // "date": formatDate(BaseAnimeCurrent[key]?.material_data?.aired_on),
                // "date": formatDate(base_anime.base[e.shikimori_id].next_episode_at),
                "voice": BaseAnimeCurrent[key]?.material_data?.status,
                "series": `${BaseAnimeCurrent[key]?.episode}/${BaseAnimeCurrent[key]?.material_data?.episodes_total ? (BaseAnimeCurrent[key]?.material_data?.episodes_total) : "?"}`,
                //  ? BaseAnimeCurrent[key]?.material_data?.episodes : "M",
                "link": BaseAnimeCurrent[key]?.material_data?.link,
                "kp": "",
                "imdb": "",
                "shikimori": key,
                "status": BaseAnimeCurrent[key]?.material_data?.status,
                "raiting": BaseAnimeCurrent[key]?.material_data?.score,
                "material_data": [],
                "id": key,
                "screenshots": [],
                "e": [],
            }
            list_resume.appendChild(add_cart(e1))
        }
    }
    localStorage.setItem('BaseAnimeCurrent', JSON.stringify(BaseAnimeCurrent));
    load.show(false)

}
/*resume_Button.addEventListener('mousedown', async (e) => {
    GetResume()
    return
    switch (e.button) {
        case 0:
            window.getCalendar()
            DialogVideoInfo.classList.add("d-none")
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
});*/


/////////////////////////////////////////////// Подгрузка базы данных аниме ///////////////////////////////////////////////////
async function anim_data(id) {
    console.log(url_get.searchParams.get("shikimori_id"))
    const response = await fetch(`https://${MyServerURL}/kodik.php?method=search&limit=1&with_material_data=true&shikimori_id=${id}`);
    data = await response.json(response);
    data_anime = data.results[0]
    return data_anime
    console.log("anime", data_anime)
}
/////

///////////////////////////////////////////// Функция по созданию рейтинга пользователя  //////////////////////////////////////////////////////////////////
function raitnig_user() {
    var raitnig_user = 0
    const currentYear = new Date().getFullYear()
    sh_api.Favorits.data.forEach(e => {
        // debug.log(e.anime.id, e.anime.episodes_aired, e.anime.episodes, e.anime.kind, { "e": e })

        var raitnig_user_local = 0
        if (e.anime.score) {
            raitnig_user_local += parseFloat(e.anime.score);
        }

        if (e.anime.aired_on) {
            raitnig_user_local += currentYear - parseFloat(e.anime.aired_on.split('-'));
        } else if (e.anime.released_on) {
            raitnig_user_local += currentYear - parseFloat(e.anime.released_on.split('-'));
        } else {
            raitnig_user_local += currentYear - 2010;
        }
        raitnig_user_local += parseFloat(e.anime.score)
        if (e.anime.episodes) {
            raitnig_user_local += e.anime.episodes
        } else if (e.anime.episodes_aired) {
            raitnig_user_local += e.anime.episodes_aired
        } else {
            raitnig_user_local += 12
        }

        if (e.anime.kind == "movie") raitnig_user_local += 20


        switch (e.status) {
            case "watching":
                raitnig_user_local = raitnig_user_local * 0.7;
                break;
            case "completed":
                raitnig_user_local = raitnig_user_local * 1;
                break;
            case "dropped":
                raitnig_user_local = raitnig_user_local * 0.3;
                break;
            case "on_hold":
                raitnig_user_local = raitnig_user_local * 0.5;
                break;
            case "planned":
                raitnig_user_local = raitnig_user_local * 0.3;
                break;
            case "rewatching":
                raitnig_user_local = raitnig_user_local * 1.2;
                break;

            default:
                break;
        }

        if (parseFloat(e.anime.score) > 0) raitnig_user_local = raitnig_user_local * (parseFloat(e.anime.score) / 10);

        // debug.log((parseFloat(e.anime.score)/10))
        if (e.anime.kind == "tv_special") raitnig_user_local *= 0.5
        if (e.anime.kind == "special") raitnig_user_local *= 0.5

        raitnig_user += raitnig_user_local

        // if (e.anime.id == 21) {
        //     debug.log("a", e.id, e.anime.episodes_aired, e.anime.episodes, e.anime.kind, { "e": e.anime })
        //     debug.log("t", raitnig_user_local)
        // }

    });
    return Math.round(raitnig_user);
}

function reiting_popup() {
    showToast({
        cover: sh_api.UserData.image.x160 ? sh_api.UserData.image.x160 : sh_api.UserData.avatar,
        title: "Он высчитывается на основе просмотренных, брошенных, отложенных, пересматриваемых и запланированных аниме, так же учитывается их дата выхода, количество серий и ещё многих других фаторов.",
        date: {
            string: "",
        },
        voice: `Ваш рейтинг пользователя на сайте: ⭐️${_raitnig_user}`,
        sound_mute: true,
    })
}

//Функция для проверки сайт открыт с хостинга или локально по ip
function isLocal() {
    const hostname = window.location.hostname;
    // Регулярное выражение для IPv4
    const ipv4Pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    // Регулярное выражение для IPv6
    const ipv6Pattern = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::(?:[0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4}$|^[0-9a-fA-F]{1,4}::(?:[0-9a-fA-F]{1,4}:){0,5}[0-9a-fA-F]{1,4}$|^[0-9a-fA-F]{1,4}:[0-9a-fA-F]{1,4}::(?:[0-9a-fA-F]{1,4}:){0,4}[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){0,2}[0-9a-fA-F]{1,4}::(?:[0-9a-fA-F]{1,4}:){0,3}[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){0,3}[0-9a-fA-F]{1,4}::(?:[0-9a-fA-F]{1,4}:){0,2}[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){0,4}[0-9a-fA-F]{1,4}::(?:[0-9a-fA-F]{1,4}:)?[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){0,5}[0-9a-fA-F]{1,4}::[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4}::$/;

    return ipv4Pattern.test(hostname) || ipv6Pattern.test(hostname);
}

// Функция для отправки POST запроса с данными пользователя
async function sh_saveUserData(userData) {
    try {
        const response = await fetch(`https://${MyServerURL}/sh_save_user.php`, {
            method: 'POST',
            mode: 'cors', // Включаем CORS
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        debug.log("Пользователи ", result.users)
        sh_api.all_users = result.users;
        UserDataTableRaieng(sh_api.all_users)
    } catch (error) {
    }
}

function UserDataTableRaieng(users) {
    // Сортировка по рейтингу по убыванию
    users.sort((a, b) => b.raitnig_user - a.raitnig_user);

    const tableBody = document.getElementById('userTableBody');
    tableBody.innerHTML = ''; // Очистка тела таблицы
    for (let i = 0; i < 1; i++) {
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${user.avatar}" alt="${user.nickname}'s avatar" style="width: 48px; height: 48px;"></td>
                <td><a href="${user.url}" target="_blank">${user.nickname}</a></td>
                <td>${user.raitnig_user}</td>
                <td>${new Date(user.last_online_at).toLocaleString('ru-RU')}</td>
            `;
            tableBody.appendChild(row);
        });

    }

}

async function load_server_base() {
    if (sh_api.authorize == false) return
    var response = await fetch(`https://${MyServerURL}/ta_user_base.php?id=${sh_api.UserData.id}`);
    var user_data = await response.json()
    if (!user_data.message) {
        debug.log("user_data_server", user_data)
        debug.log("Test_data", user_data)
        base_anime = user_data.base_anime
        BaseAnimeCurrent = user_data.BaseAnimeCurrent
        localStorage.setItem('BaseAnime', JSON.stringify(base_anime));

    }
    return user_data
}

async function save_server_base() {
    if (sh_api.authorize == false) return
    const response = await fetch(`https://${MyServerURL}/ta_user_base.php?id=${encodeURIComponent(sh_api.UserData.id)}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            base_anime,
            BaseAnimeCurrent
        })
    });

    debug.log("Ответ от сервера:", response);
    return response

}


/////// Управление с пульта tv
let main_i = -1;
let button_player_i = -1;
let button_player_list = document.querySelectorAll(".player_button")
// Создаем событие mousedown
const mouseDownEvent = new MouseEvent('mousedown', {
    bubbles: true, // Событие будет всплывать
    cancelable: true, // Событие можно отменить
    view: window // Контекст окна
});




document.addEventListener('keydown', (e) => {
    return
    if (url_get.searchParams.get('shikimori_id')) {
        switch (e.key) {
            case 'ArrowDown':
            case 'ArrowRight':
                e.preventDefault();
                button_player_i = (button_player_i + 1) % button_player_list.length;
                button_player_list[button_player_i].focus();
                break;
            case 'ArrowUp':
            case 'ArrowLeft':
                e.preventDefault();
                button_player_i = (button_player_i - 1 + button_player_list.length) % button_player_list.length;
                button_player_list[button_player_i].focus();
                break;
            case 'Enter':
                e.preventDefault();
                button_player_list[button_player_i].click();
                break;
        }
    } else {
        let items = document.querySelector('#list_serch').querySelectorAll(':scope > .cart_.bg-dark:not(.hide)');
        let firstItemTop = items[main_i > -1 ? main_i : 0].getBoundingClientRect().top;

        let itemsInRow = 0;
        for (const item of items) {
            const itemTop = item.getBoundingClientRect().top;
            if (Math.abs(itemTop - firstItemTop) < 10) {
                itemsInRow++;
            } else {
                //break; // Прерываем цикл, как только начинается новая строка
            }
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                main_i = (main_i + itemsInRow) % cart_list.length;
                cart_list[main_i].focus();
                break;
            case 'ArrowRight':
                e.preventDefault();
                main_i = (main_i + 1) % cart_list.length;
                cart_list[main_i].focus();
                break;
            case 'ArrowUp':
                e.preventDefault();
                main_i = (main_i - itemsInRow + cart_list.length) % cart_list.length;
                cart_list[main_i].focus();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                main_i = (main_i - 1 + cart_list.length) % cart_list.length;
                cart_list[main_i].focus();
                break;
            case 'Enter':
                e.preventDefault();
                cart_list[main_i].querySelector(".cart-img-top").dispatchEvent(mouseDownEvent);
                break;
        }
    }
});

document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
        starrySky.stop()
    } else if (document.visibilityState === 'visible') {
        if (document.getElementById("DialogVideoInfo").classList.contains('d-none')) {
            // starrySky.stop()
        }
        else {
            starrySky.start()
        }
    }
});

function FontsCustom(newFilePath) {
    // Находим существующий CSS файл (например, по id или классу)
    const oldLink = document.querySelector('#fonts_custom');
    if (oldLink?.name == newFilePath) return
    if (oldLink) {
        oldLink.remove(); // Удаляем старый CSS
    }
    if (!newFilePath) return
    // Добавляем новый CSS
    const newLink = document.createElement('link');
    newLink.rel = 'stylesheet';
    newLink.type = 'text/css';
    newLink.id = 'fonts_custom';
    newLink.href = `fonts/${newFilePath}.css`;
    newLink.name = newFilePath;
    document.head.appendChild(newLink);
    base_anime.Fonts = newFilePath;

    localStorage.setItem('BaseAnime', JSON.stringify(base_anime));
    save_server_base()
}

//<link href="/fonts/Pangolin.css" rel="stylesheet" />

async function DownloadAPK(link) {
    // Проверяем, доступен ли интерфейс AndroidApp

    if (window.AndroidApp) {
        const response = await fetch('app/output-metadata.json');
        if (!response.status) return
        const json = await response.json();
        if (json.elements[0].versionCode.toString() != navigator.userAgent.split("|").pop()) {

            BrowserOpen(link)
        }
    }
}

async function BrowserOpen(link) {
    if (window.AndroidApp) {
        window.AndroidApp.downloadApk(link);
    }
}

DownloadAPK("https://track-anime.github.io/app/TrackAnimeByDygDyg.apk")
