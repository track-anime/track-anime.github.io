var data, dat, targetFrame, endid, endid2, prev_page, SH_UserData, SH_Favorite, cart_data, backgrounds
var ld = false, SH_isAvtorize = false;
var AnimeScanID = {}
const scrollM = 2000;
var ignoreVoice = false
window.moment.locale('ru')
var HistoryIsActivy = true
var TypePage = 0
document.body.r = 2
var url_get = new URL(window.location.href)
const KeyTab = Math.floor(Math.random() * 10000000000)
const VideoPlayerAnime = document.getElementById('VideoPlayerAnime');
const VideoInfo = document.getElementById('VideoInfo');
const VoiceSettings = document.getElementById('VoiceSettings');
const VideoPlayer = document.getElementById('VideoPlayer');
const list_calendar = document.getElementById("list_calendar");
const container_ = document.body.querySelector('.container_');
const load = document.getElementById("load");

const nav_panel_buttons = document.querySelector('nav.navbar.navbar-expand-lg.bg-body-tertiary.sticky-top')
// const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
// const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))



const URLSearch = "https://kodikapi.com/search?token=45c53578f11ecfb74e31267b634cc6a8&with_material_data=true&title="
var URLList = "https://kodikapi.com/list?limit=100&with_material_data=true&camrip=false&token=45c53578f11ecfb74e31267b634cc6a8"//&countries=Япония"
var URLCalendar = "https://kodikapi.com/list?limit=100&with_material_data=true&camrip=false&token=45c53578f11ecfb74e31267b634cc6a8&anime_status=ongoing"//&anime_kind=tv"//&countries=Япония"
var URLListStart = "https://kodikapi.com/list?limit=100&with_material_data=true&camrip=false&token=45c53578f11ecfb74e31267b634cc6a8"



window?.Notification?.requestPermission()
sh_api.get_user()

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
    "description": VideoInfo.querySelector("#info_description"),

    "countries": VideoInfo.querySelector("#info_countries"),
    "genres": VideoInfo.querySelector("#info_genres"),
    "series": VideoInfo.querySelector("#info_series"),
    "studios": VideoInfo.querySelector("#info_studios"),
    "updated_at": VideoInfo.querySelector("#info_updated_at"),
    "screenshots": VideoInfo.querySelector("#info_screenshots"),
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
    "KodikPlayer": VideoInfo.querySelector("#info_KodikPlayer"),


}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
setInterval(() => {
    if (!HistoryIsActivy || ld) return
    GetKodi("", true)
}, 30 * 1000);  //Автопроверка 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// URLListStart = url_get.searchParams.get('anime_genres')?`${URLListStart}&anime_genres=${encodeURIComponent(url_get.searchParams.get('anime_genres'))}`:URLListStart


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////Проверка гет фильтров поиска///////////////////////////////////////////////////////////
URLList = url_get.searchParams.get('anime_genres') ? `${URLList}&anime_genres=${encodeURIComponent(url_get.searchParams.get('anime_genres'))}` : URLList
URLList = url_get.searchParams.get('rating_mpaa') ? `${URLList}&rating_mpaa=${encodeURIComponent(url_get.searchParams.get('rating_mpaa'))}` : URLList
URLList = url_get.searchParams.get('year') ? `${URLList}&year=${encodeURIComponent(url_get.searchParams.get('year'))}` : URLList
URLList = url_get.searchParams.get('countries') ? `${URLList}&countries=${encodeURIComponent(url_get.searchParams.get('countries'))}` : URLList
URLList = url_get.searchParams.get('anime_studios') ? `${URLList}&anime_studios=${encodeURIComponent(url_get.searchParams.get('anime_studios'))}` : URLList
URLList = url_get.searchParams.get('anime_status') ? `${URLList}&anime_status=${encodeURIComponent(url_get.searchParams.get('anime_status'))}` : URLList
URLListStart = URLList

function setVideoInfo(e) {
    var html
    const tv = e.material_data.anime_kind ? ` [${e.material_data.anime_kind.toUpperCase()}]` : ""
    VideoInfo.info.cover.src = e.material_data.poster_url;
    VideoInfo.info.title.textContent = e.material_data.anime_title ? `${tv} ${e.material_data.anime_title}` : "?";

    VideoInfo.info.countries.textContent = e.material_data.countries ? e.material_data.countries : "?";
    VideoInfo.info.countries.href = `${window.location.origin + window.location.pathname}?countries=${e.material_data.countries ? e.material_data.countries : ""}`;

    var tmp346 = e.material_data.episodes_aired ? e.material_data.episodes_aired : "?";
    tmp346 = tmp346 + `/${e.material_data.episodes_total ? e.material_data.episodes_total : "?"}`;

    VideoInfo.info.series.textContent = tmp346;
    // VideoInfo.info.countries.href = `${window.location.origin + window.location.pathname}?countries=${e.material_data.countries ? e.material_data.countries : ""}`;

    VideoInfo.info.description.textContent = e.material_data.description ? e.material_data.description : "?";

    VideoInfo.info.info_status.textContent = e.material_data.anime_status ? e.material_data.anime_status : "?";
    VideoInfo.info.info_status.href = `${window.location.origin + window.location.pathname}?anime_status=${e.material_data.anime_status ? e.material_data.anime_status : ""}`;

    VideoInfo.info.studios.textContent = e.material_data.anime_studios ? e.material_data.anime_studios : "?";
    VideoInfo.info.studios.href = `${window.location.origin + window.location.pathname}?anime_studios=${e.material_data.anime_studios ? e.material_data.anime_studios : ""}`;

    VideoInfo.info.year.textContent = e.material_data.year ? e.material_data.year : "?";
    VideoInfo.info.year.href = `${window.location.origin + window.location.pathname}?year=${e.material_data.year ? e.material_data.year : ""}`;

    VideoInfo.info.rating_mpaa.textContent = e.material_data.rating_mpaa ? e.material_data.rating_mpaa : "?";
    VideoInfo.info.rating_mpaa.href = `${window.location.origin + window.location.pathname}?rating_mpaa=${e.material_data.rating_mpaa ? e.material_data.rating_mpaa : ""}`;

    const dat = e.material_data.next_episode_at ? e.material_data.next_episode_at : e.e.created_at

    if (e.material_data.anime_status == "ongoing" && formatDate(dat).moment.diff(moment.now(), "minute") > 0) {

        // VideoInfo.info.updated_at_text.textContent = e.material_data.anime_status == "ongoing" ? "Следующая серия выйдет " : "Последняя серия вышла ";
        VideoInfo.info.updated_at.textContent = `Следующая серия выйдет ${formatDate(dat).moment.fromNow().toLowerCase()}. ${formatDate(dat).moment.calendar()}`
    } else {
        VideoInfo.info.updated_at.textContent = `Вышла ${formatDate(dat).moment.fromNow().toLowerCase()}. ${formatDate(dat).moment.calendar()}`
    }

    VideoInfo.info.title.innerHTML = `•${VideoInfo.info.title.textContent} <br>• [${VideoInfo.info.updated_at.textContent}]`

    VideoInfo.info.shikimori_rating.style.width = e.material_data.shikimori_rating ? `${e.material_data.shikimori_rating * 10}%` : "0%";
    VideoInfo.info.shikimori_rating.textContent = e.material_data.shikimori_rating ? `${e.material_data.shikimori_rating}/10` : "?";
    VideoInfo.info.shikimori_votes.textContent = e.material_data.shikimori_votes ? `${e.material_data.shikimori_votes} проголосовавших` : "?";
    VideoInfo.info.shikimori_link.href = `https://shikimori.one/animes/${e.shikimori ? e.shikimori : ""}`;

    VideoInfo.info.imdb_rating.style.width = e.material_data.imdb_rating ? `${e.material_data.imdb_rating * 10}%` : "0%";
    VideoInfo.info.imdb_rating.textContent = e.material_data.imdb_rating ? `${e.material_data.imdb_rating}/10` : "?";
    VideoInfo.info.imdb_votes.textContent = e.material_data.imdb_votes ? `${e.material_data.imdb_votes} проголосовавших` : "?";
    VideoInfo.info.IMDB_link.href = `https://www.imdb.com/title/${e.imdb ? e.imdb : ""}`;

    e.imdb ? document.getElementById("imdb_info").classList.remove('hide') : document.getElementById("imdb_info").classList.add('hide')
    // e.imdb||e.kp ? VideoInfo.info.AlohaPlayer.classList.remove('hide') : VideoInfo.info.AlohaPlayer.classList.add('hide')
    VideoInfo.info.AlohaPlayer.textContent = e.imdb ? "Смотреть Alloha Player" : "Alloha!! Мне повезёт!!"
    VideoInfo.info.AlohaPlayer.title = "Зажать shift для поиска по названию"
    VideoInfo.info.AlohaPlayer.addEventListener('click', (ev) => {

        let DialogVideoInfo = document.getElementById('DialogVideoInfo');
        DialogVideoInfo.classList.remove("DialogVideoInfoScroll");
        VideoPlayer.contentWindow.location.href = e.imdb ? `https://dygdyg.github.io/DygDygWEB/svetacdn.htm?menu_default=menu_button&imdb=${e.imdb}` : `https://dygdyg.github.io/DygDygWEB/svetacdn.htm?menu_default=menu_button&title=${e.material_data.anime_title}`
        if (ev.shiftKey) {
            VideoPlayer.contentWindow.location.href = `https://dygdyg.github.io/DygDygWEB/svetacdn.htm?menu_default=menu_button&title=${e.material_data.anime_title}`
        }
    })

    VideoInfo.info.KodikPlayer.addEventListener('click', () => {
        let DialogVideoInfo = document.getElementById('DialogVideoInfo');
        DialogVideoInfo.classList.remove("DialogVideoInfoScroll");

        VideoPlayer.contentWindow.location.href = e.link;
        // VideoPlayer.contentWindow.location.href = `https://dygdyg.github.io/DygDygWEB/svetacdn.htm?loadserv=kinobox&imdb=${e.imdb}`
    })

    html = ""
    e.material_data.screenshots?.forEach(el => {
        html = html + `
        <div class="carousel-item">
        <img src="${el}"
            class="d-block w-100" alt="...">
    </div>
    ` });

    /*    e.screenshots?.forEach(el => {
           html = html + `
           <div class="carousel-item">
           <img src="${el}"
               class="d-block w-100" alt="...">
       </div>
       ` }); */

    e.material_data.screenshots || e.screenshots ? VideoInfo.info.screenshots.parentNode.classList.remove("hide") : VideoInfo.info.screenshots.parentNode.classList.add("hide")
    VideoInfo.info.screenshots.innerHTML = html;
    VideoInfo.info.screenshots.querySelectorAll(".carousel-item")[0]?.classList.add("active");

    html = "Жанры: "
    e.material_data.anime_genres?.forEach(el => {
        html = html + `
        <a href="${window.location.origin + window.location.pathname}?anime_genres=${el}"class="info_genre link-danger link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">${el}</a>
        `
    })
    VideoInfo.info.genres.innerHTML = html;

    var btn_sh_save = document.getElementById('btn_sh_save')
    btn_sh_save.ids = e.shikimori ? e.shikimori : null;
    if (sh_api.authorize) {
        sh_api.get_favorit()
    } else {
        btn_sh_save.classList.add("hide")
        return
    }
    btn_sh_save.sh_fv = sh_api.Favorits.data.find(item => item.anime.id == e.shikimori)

    btn_sh_save.classList.remove("hide")
    btn_sh_save.classList.remove("btn-outline-light")
    btn_sh_save.classList.remove("btn-primary")
    btn_sh_save.classList.remove("btn-success")
    btn_sh_save.classList.remove("btn-danger")
    btn_sh_save.classList.remove("btn-warning")
    btn_sh_save.classList.remove("btn-secondary")
    btn_sh_save.classList.remove("btn-info")

    switch (btn_sh_save?.sh_fv?.status) {
        case "watching":
            btn_sh_save.textContent = "смотрю"
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
            btn_sh_save.classList.add("btn-secondary")
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

document.addEventListener("authorize", function (e) { // (1)
    document.getElementById("list_login_Button").classList.add('hide')
    document.getElementById("User_Menu_Button").classList.remove('hide')
    // console.log(1, sh_api.UserData)
    document.getElementById("User_Menu_Button").querySelector('img').src = sh_api.UserData.avatar
    document.getElementById("User_Menu_Button").querySelector('span').textContent = sh_api.UserData.nickname

    // console.log("authorize", e)
    sh_api.Favorits.data.forEach(e => {
        // console.log(e)
        if (e.status == "watching" && !base_anime.fav.includes(e.anime.id.toString())) {
            base_anime.fav.push(e.anime.id.toString())
            localStorage.setItem('BaseAnime', JSON.stringify(base_anime));
        }  //sh_api.Favorits.ids.push(e.anime.id)
    });
});


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

closeDialogButton.addEventListener('click', () => {
    DialogVideoInfo.classList.remove("DialogVideoInfoScroll")
    VideoPlayerAnime.close();
    VideoPlayer.contentWindow.location.href = "../index.htm";
    url_get.searchParams.delete("shikimori_id")
    url_get.searchParams.delete("id")

    window.history.pushState({}, '', url_get);
});
document.getElementById("list_calendar_Button").addEventListener('click', async () => {
    getCalendar()
});
document.getElementById("list_home_Button").addEventListener('click', async () => {
    getHome()
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

VideoPlayerAnime.addEventListener("close", () => {
    document.title = "Track Anime By ДугДуг"
});


// window.onscroll = function () {
container_.addEventListener('scroll', async function (e) {
    if (container_.clientHeight + container_.scrollTop > container_.scrollHeight - scrollM && HistoryIsActivy && !ld) {
        GetKodi()
        // setTimeout(GetKodi, 0)
    }
});

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


///////////////////// GET параметры 
get_settings()
async function get_settings() {
    if (url_get.searchParams.get('id') || url_get.searchParams.get('shikimori_id')) {

        e = await httpGet(url_get.searchParams.get('shikimori_id') ?
            `https://kodikapi.com/search?token=45c53578f11ecfb74e31267b634cc6a8&with_material_data=true&shikimori_id=${url_get.searchParams.get('shikimori_id')}` :
            `https://kodikapi.com/search?token=45c53578f11ecfb74e31267b634cc6a8&with_material_data=true&id=${url_get.searchParams.get('id')}`
        )
        e = e.results[0]
        const ed = {
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
        dialog(ed, true)
    }
}
// url_get.searchParams.delete("seartch")

async function getHome(iss) {
    // location.reload()
    HistoryIsActivy = true
    TypePage = 0
    document.getElementById("list_calendar").classList.add("hide")
    document.getElementById("list_history").classList.add("hide")
    document.getElementById("list_serch").classList.remove("hide")

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
    document.getElementById("list_history").classList.add("hide")
    document.getElementById("list_serch").classList.add("hide")
    document.getElementById("list_calendar").classList.remove("hide")
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
        dialog(e, !event.shiftKey)
    })

}

function AddFavorite(t) {
    console.log(t)

    var e1 = document.getElementById('btn_sh_save')

    e1.classList.remove("btn-outline-light")
    e1.classList.remove("btn-primary")
    e1.classList.remove("btn-success")
    e1.classList.remove("btn-danger")
    e1.classList.remove("btn-warning")
    e1.classList.remove("btn-secondary")
    e1.classList.remove("btn-info")

    switch (t) {
        case 0:
            e1.textContent = "смотрю"
            e1.classList.add("btn-primary")
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
            e1.classList.add("btn-secondary")
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

function SetFavorite(e) {
    base_anime.fav.push(e)
    localStorage.setItem('BaseAnime', JSON.stringify(base_anime));
    // console.log(1, e)
    sh_api.AddUserRates(Number(e), 0)
    // console.log(2, e)
    return base_anime.fav
}

function DeleteFavorite(e) {
    base_anime.fav = base_anime.fav.filter(item => !item.includes(e));
    localStorage.setItem('BaseAnime', JSON.stringify(base_anime));
    // console.log(3, e)
    sh_api.AddUserRates(Number(e), 1)
    // console.log(4, e)
    return base_anime.fav
}

function GetFavorite(e) {
    let result = base_anime.fav.filter(item => item.toLowerCase().includes(e.toLowerCase()));
    if (result.length > 0) {
        return true
    }
    return false
}
function VoiceSettingsMenu() {
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
    saveButton.className = 'btn btn-primary mt-3';
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
        VoiceSettings.innerHTML = ""
        VoiceSettings.close()
        location.reload();
    });

    VoiceSettings.showModal()

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

function add_cart(e) {
    const cart = document.createElement('div');
    cart.data = e;
    cart.classList.add('cart_', 'bg-dark', 'text-white');
    cart.r = e.raiting
    document.body.r > cart.r ? cart.classList.add('hide') : null;

    cart.addEventListener("mousedown", (event) => {
        console.log(event.which, event.button);
        var a = new URL(window.location.href)
        a.searchParams.set("shikimori_id", `${e.shikimori}`)
        // console.log(a.href);
        // console.log(e.shikimori);
        // return
        if(event.button==1)  return window.open(a.href, '_blank')
        e.shift = event.shiftKey
        dialog(e, !event.shiftKey)
        cart.classList.remove("new_cart")
    })

    const imgTop = document.createElement('div');
    imgTop.style.backgroundImage = `url(${e.cover}`;
    imgTop.src = e.cover;
    imgTop.classList.add('cart-img-top');
    imgTop.alt = 'cover';
    cart.appendChild(imgTop);

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
    cartFavorite.textContent = "♥";
    cartFavorite.title = e.series;
    imgTop.appendChild(cartFavorite);
    cartFavorite.style.color = GetFavorite(e.shikimori) ? "#ffdd00" : "#ffffff"

    cart.addEventListener("mouseover", (ev) => {
        cartFavorite.style.color = GetFavorite(e.shikimori) ? "#ffdd00" : "#ffffff"
    });

    cartFavorite.addEventListener("click", (ev) => {
        ev.stopPropagation();
        if (GetFavorite(e.shikimori)) {
            cartFavorite.style.color = "#ffffff"
            DeleteFavorite(e.shikimori)
        } else {
            cartFavorite.style.color = "#ffdd00"
            SetFavorite(e.shikimori)
        }


    })
    // setTimeout(() => cart.classList.add("cart_spawn"), 0)

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

document.addEventListener('DOMContentLoaded', function () {
    // showToast();
});

function showToast(e) {
    // prompt("",JSON.stringify(e))
    var audio = new Audio();
    audio.preload = 'auto';
    audio.src = './meloboom.mp3';
    audio.play();
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

function dialog(e, info) {
    if (e.shift) {
        // return
        if (confirm(`Добавить аниме "${e.title}" в список "смотрю" на shikimori?`)) {
            // AddUserRates(e.shikimori)
        };

        //showToast(e);
        // add_push(e)
        return
    }
    setVideoInfo(e)
    url_get.searchParams.set("shikimori_id", `${e.shikimori}`)
    window.history.pushState({}, '', url_get);
    document.title = `TA: ${e.title}`



    VideoPlayerAnime.showModal();

    // if ((e.imdb || e.kp) && e.shift) {
    //     VideoPlayer.contentWindow.location.href = e.kp ? `//dygdyg.github.io/DygDygWEB/svetacdn.htm?loadserv=kinobox&kinopoiskID=${e.kp}` : `//dygdyg.github.io/DygDygWEB/svetacdn.htm?loadserv=kinobox&imdb=${e.imdb}`
    //     return
    // }

    VideoPlayer.contentWindow.location.href = e.link

    info ? DialogVideoInfo.classList.add("DialogVideoInfoScroll") : DialogVideoInfo.classList.remove("DialogVideoInfoScroll")
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
async function GetKodi(seartch, revers) {
    ld = true
    // if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - scrollM && HistoryIsActivy == true && document.getElementById('search_input').value ) {
    // if(container_.clientHeight + container_.scrollTop > container_.scrollHeight - scrollM){
    if ((window.innerHeight + window.scrollY) >= container_.offsetHeight - scrollM) {
        if (!seartch || seartch == undefined || seartch == "") {
            HistoryIsActivy = true
            ignoreVoice = false
            document.getElementById('list_history').classList.add("hide")
            targetFrame = document.getElementById('list_serch')
            targetFrame.classList.remove("hide")

            if (revers) {
                dat = await httpGet(URLListStart)
                endid2 = dat.results[0].id
            } else {
                dat = await httpGet(URLList)
                URLList = dat.next_page
                endid = endid ? endid : dat.results[0].id

            }

            url_get = new URL(window.location.href)
            url_get.searchParams.delete("seartch")
            window.history.pushState({}, '', url_get);
        } else {
            getHome(true)
            HistoryIsActivy = false
            ignoreVoice = true
            document.getElementById('search_input').value = decodeURIComponent(seartch)
            targetFrame = document.getElementById('list_history')
            targetFrame.classList.remove("hide")
            targetFrame.innerHTML = ""
            document.getElementById('list_serch').classList.add("hide")
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

GetKodi(url_get.searchParams.get('seartch'))


function ScanBase(e, i, revers) {
    document.getElementById("loading-bar").classList.remove("hide");
    var t = 0
    if (i >= e.length) {
        GetKodiScan(data, revers)

        document.getElementById("loading-bar").classList.add("hide");
        if (container_.clientHeight + container_.scrollTop > container_.scrollHeight - scrollM && HistoryIsActivy) {

            GetKodi()
        }
        return;
    }
    const prog = `${i}%`
    document.getElementById("loading-bar").style.width = prog
    document.getElementById("loading-bar").textContent = prog

    setTimeout(() => {
        ScanBase(e, i + 1, revers);
    }, t);
}

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




