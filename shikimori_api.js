var sh_api = {}

sh_api.url_get = new URL(window.location.href)
sh_api.UserData = {}
sh_api.Favorits = {}
sh_api.all_users = []
sh_api.another = { UserData: {}, Favorits: {}, status: "0" }
sh_api.authorize = false
sh_api.authorize_ev = new Event("authorize", { bubbles: true })
sh_api.search_another = new Event("search_another", { bubbles: true })
sh_api.logout_ev = new Event("sh_api_logout", { bubbles: true })
sh_api.search_ev = new CustomEvent("sh_api_search", { bubbles: true })
sh_api.get_anime_ev = new CustomEvent("sh_get_anime", { bubbles: true })

sh_api.code = sh_api.url_get.searchParams.get('code')
sh_api.status_lable = [
    "watching",
    "completed",
    "dropped",
    "on_hold",
    "planned",
    "rewatching",
]
sh_api.status_color = {
    watching: ["#ffdd00", "смотрю"],
    // watching: ["#286090", "смотрю"],
    completed: ["#3b8a3f", "просмотренно"],
    dropped: ["#9a3838", "брошено"],
    on_hold: ["#ab7a2f", "отложено"],
    planned: ["#ff00fb", "запланировано"],
    rewatching: ["#31d2f2", "пересматриваю"],
}
sh_api.status_lable_ru = [
    "смотрю",
    "просмотренно",
    "брошено",
    "отложено",
    "запланировано",
    "пересматриваю",
]

/* document.addEventListener("authorize", function (e) { // (1)
    debug.log("authorize", e)

}); */


sh_api.getCookie = (name) => {
    var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}
sh_api.getCookie_time = (name) => {
    var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

sh_api.get_key = () => {
    // window.open(`https://shikimori.one/oauth/authorize?client_id=aBohwwIpPXeCgSlo1xorfHKPaRBsdpW0_MMF8S-7SWA&redirect_uri=${window.location.origin}${window.location.pathname}&response_type=code`, "_self");
    let qrcode = sh_api.url_get.searchParams.get('qrcode')?"?qrcode=true":""
    location.href = `https://shikimori.one/oauth/authorize?client_id=aBohwwIpPXeCgSlo1xorfHKPaRBsdpW0_MMF8S-7SWA&redirect_uri=${window.location.origin}${window.location.pathname}${qrcode}&response_type=code`
    return
    code = sh_api.url_get.searchParams.get('code')
    if (!code && !sh_api.getCookie("sh_refresh_token")) {
    }
}

sh_api.add_token = () => {
    sh_api.url_get = new URL(window.location.href)
    /*     if (sh_api.getCookie("sh_access_token") && sh_api.getCookie("sh_access_token")!="undefined") {
            return sh_api.getCookie("sh_access_token")
        } */
    if (sh_api.url_get.searchParams.get('qrcode')) return
    code = sh_api.url_get.searchParams.get('code')
    if (!code && !sh_api.getCookie("sh_refresh_token")) {
        return "no_key"
        window.open(`https://shikimori.one/oauth/authorize?client_id=aBohwwIpPXeCgSlo1xorfHKPaRBsdpW0_MMF8S-7SWA&redirect_uri=${window.location.origin}${window.location.pathname}&response_type=code`, "_self");
        return
    }
    /* 
        if (!sh_api.getCookie("sh_access_token") && sh_api.getCookie("sh_refresh_token") && sh_api.getCookie("sh_refresh_token")!="undefined") {
            debug.log("reload_token")
            sh_api.refresh_token()
    
            return
        } */

    fetch('https://shikimori.one/oauth/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Track Anime By DygDyg'
        },
        body: `grant_type=authorization_code&client_id=aBohwwIpPXeCgSlo1xorfHKPaRBsdpW0_MMF8S-7SWA&client_secret=4lyibuneC2Z34-EBoyX0tgs2ytagD4hda-SiFfpSUAo&code=${code}&redirect_uri=${window.location.origin}${window.location.pathname}`
    })
        .then(response => response.json())
        .then(data => {
            debug.log("get", data);
            if(typeof data.access_token=="string") document.cookie = `sh_access_token=${data.access_token}; path=/; max-age=${data.expires_in};`
            // document.cookie = `sh_access_token_max_age=${(new Date(Date.now() + data.expires_in * 1000)).toUTCString()}; path=/; max-age=${data.expires_in};`
            if(typeof data.refresh_token=="string") document.cookie = `sh_refresh_token=${data.refresh_token}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT"`

            sh_api.url_get.searchParams.delete("code")
            window.history.pushState({}, '', sh_api.url_get);

            // if (data.error == "invalid_grant") window.open(`https://shikimori.one/oauth/authorize?client_id=aBohwwIpPXeCgSlo1xorfHKPaRBsdpW0_MMF8S-7SWA&redirect_uri=${window.location.origin}${window.location.pathname}&response_type=code`, "_self");
            // location.reload()
            sh_api.authorize = true
            sh_api.get_user()
        })
        .catch(error => {
            sh_api.url_get.searchParams.delete("code")
            window.history.pushState({}, '', sh_api.url_get);
            console.error(error)
        });
}
sh_api.logout = () => {
    document.cookie = `sh_access_token=""; path=/; max-age=-1;`
    // document.cookie = `sh_access_token_max_age=""; path=/; max-age=-1;`
    document.cookie = `sh_refresh_token=""; path=/; max-age=-1;`
    document.cookie = `_kawai_session=""; path=/; max-age=-1;`
    sh_api.authorize = false
    document.dispatchEvent(sh_api.logout_ev);
    setTimeout(() => {
        location.reload()
    }, 1000);
}
sh_api.ClearCookie = () =>{
    return
    if (sh_api.getCookie("sh_refresh_token")=='undefined'){
        document.cookie = `sh_refresh_token=""; path=/; max-age=-1;`
        debug.log("sh_api clear sh_refresh_token")
        tmp_Clean_Cookie = true
    }
    
    if (sh_api.getCookie("sh_access_token")=='undefined'){
        document.cookie = `sh_access_token=""; path=/; max-age=-1;`
        debug.log("sh_api clear sh_access_token")
        tmp_Clean_Cookie = true
    }
/*     if (sh_api.getCookie("sh_access_token_max_age")=='undefined'){
        document.cookie = `sh_access_token_max_age=""; path=/; max-age=-1;`
        debug.log("sh_api clear sh_access_token_max_age")
        tmp_Clean_Cookie = true
    } */
    if (sh_api.getCookie("_kawai_session")=='undefined'){
        document.cookie = `_kawai_session=""; path=/; max-age=-1;`
        debug.log("sh_api clear _kawai_session")
        tmp_Clean_Cookie = true
    }
    if(tmp_Clean_Cookie==true) navigator.reload()
}

sh_api.refresh_token = () => {



    if (sh_api.getCookie("sh_access_token")) {
        return sh_api.getCookie("sh_access_token")
    }

    if (!sh_api.getCookie("sh_refresh_token")) {
        sh_api.authorize = false
        return "No_Authorize"
        window.open(`https://shikimori.one/oauth/authorize?client_id=aBohwwIpPXeCgSlo1xorfHKPaRBsdpW0_MMF8S-7SWA&redirect_uri=${window.location.origin}${window.location.pathname}&response_type=code`, "_self");
    }

    fetch('https://shikimori.one/oauth/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Track Anime By DygDyg'
        },
        body: `grant_type=refresh_token&client_id=aBohwwIpPXeCgSlo1xorfHKPaRBsdpW0_MMF8S-7SWA&client_secret=4lyibuneC2Z34-EBoyX0tgs2ytagD4hda-SiFfpSUAo&refresh_token=${sh_api.getCookie("sh_refresh_token")}`
    })
        .then(response => response.json())
        .then(data => {
            debug.log("rf", data);
            if(typeof data.access_token=="string")document.cookie = `sh_access_token=${data.access_token}; path=/; max-age=${data.expires_in};`
            if(typeof data.refresh_token=="string")document.cookie = `sh_refresh_token=${data.refresh_token}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT"`
            if (data.error == "invalid_grant") window.open(`https://shikimori.one/oauth/authorize?client_id=aBohwwIpPXeCgSlo1xorfHKPaRBsdpW0_MMF8S-7SWA&redirect_uri=${window.location.origin}${window.location.pathname}&response_type=code`, "_self");
            sh_api.authorize = true
            sh_api.get_user()
            // location.reload()
        })
        .catch(error => console.error("d", error));
    return "await"
}

sh_api.get_user = (user, isanother) => {
    if (!sh_api.getCookie("sh_access_token") && !isanother) {
        const ot = sh_api.refresh_token()
        if (ot == "No_Authorize" || ot == "await") return ot
    }
    // debug.log(encodeURI(user))
    var url = `https://shikimori.one/api/users/${user ? encodeURI(user) : "whoami"}?access_token=${sh_api.getCookie("sh_access_token")}`
    if (isanother) url = `https://shikimori.one/api/users/${encodeURI(user)}`
    fetch(url)
        .then(response => {
            sh_api.another.status = response.status
            if (response.ok) {
                return response.json();
            } else {

                if (response.status == "404") return response.status

                throw new Error('Ответ сети был не в порядке. get_user');
            }
        })
        .then(data => {
            if (data == "404") {
                debug.log("404 Пользователь не найден")
                document.dispatchEvent(sh_api.search_another);
                sh_api.get_favorit(sh_api.UserData.id)
                return
            }
            if (!isanother) sh_api.authorize = true
            debug.log("user_data", data);
            isanother ? sh_api.another.UserData = data : sh_api.UserData = data
            sh_api.get_favorit(sh_api.another.UserData.id, isanother)
        })
        .catch(error => {

            console.error('Возникла проблема с операцией выборки get_user:', error);
        });


    // document.cookie = getCookie("KeyTab") ? `` : `KeyTab=${KeyTab}; path=/; max-age=10`
}
sh_api.get_fav_color = (id) => {  //Возвращает по id цвет избранного
    if (!sh_api?.authorize) return
    if (!sh_api?.Favorits?.data) return
    id_status = sh_api.Favorits?.data?.find(e => e.anime.id == id)?.status

    return [id_status ? sh_api.status_color[id_status][0] : "#ffffff", id_status ? sh_api.status_color[id_status][1] : "не добавлено"]
}

sh_api.get_favorit = (sh_user, isanother) => {
    if (!sh_api.getCookie("sh_access_token") && !isanother) {
        const ot = sh_api.refresh_token()
        if (ot == "No_Authorize") return ot
    }
    var url = `https://shikimori.one/api/users/${sh_user ? encodeURI(sh_user) : encodeURI(sh_api.UserData.id)}/anime_rates?limit=5000&access_token=${sh_api.getCookie("sh_access_token")}`
    if (isanother) url = `https://shikimori.one/api/users/${sh_user ? encodeURI(sh_user) : encodeURI(sh_api.UserData.id)}/anime_rates?limit=5000`

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Ответ сети был не в порядке. get_favorit');
            }
        })
        .then(data => {
            if (isanother) {
                sh_api.another.Favorits.data = data
                // debug.log(sh_api.another.UserData.nickname, sh_api.another.Favorits.data)
                document.dispatchEvent(sh_api.search_another);
            } else {
                if (!isanother) sh_api.authorize = true
                // debug.log("anime_rates", data);
                if (sh_user) {
                    sh_api.Favorits[sh_user] = data
                } else {
                    sh_api.Favorits.data = data
                    sh_api.Favorits.ids = []
                    sh_api.Favorits.data.forEach(e => {
                        if (e.status == "watching") sh_api.Favorits.ids.push(e.anime.id)
                    });
                    document.dispatchEvent(sh_api.authorize_ev);
                }
            }

        })
        .catch(error => {
            console.error('Возникла проблема с операцией выборки get_favorit:', error);
        });
}

sh_api.AddUserRates = (id, sl) => {  ///Добавляет - изменяет аниме в избранном
    if (!sh_api.authorize) return debug.log("Вы не авторизированы")
    var url = `https://shikimori.one/api/user_rates?access_token=${sh_api.getCookie("sh_access_token")}`
    fetch(url, {
        method: 'POST',
        // credentials: 'include',

        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Track Anime By DygDyg',
            // 'Cookie': `${getCookie("_kawai_session")}`
        },
        body: `user_rate%5Buser_id%5D=${sh_api.UserData.id}&`
            + `user_rate%5Btarget_id%5D=${id}&`
            + `user_rate%5Btarget_type%5D=Anime&`
            + `user_rate%5Bstatus%5D=${sh_api.status_lable[sl ? sl : 0]}&`
    })
        .then(response => response.json())
        .then(data => {
            debug.log("AddUserRates", data)
            sh_api.get_favorit(url_get.searchParams.get('sh_user_fav'), true)
        })
        .catch(error => console.error(error));
}





sh_api.get_anime = (id) => {
    // debug.log(id)
    var url = `https://shikimori.one/api/animes/${id}`
    if(sh_api.authorize==true) url=`${url}?access_token=${sh_api.getCookie("sh_access_token")}`
    fetch(url)
        .then(response => {
            sh_api.another.status = response.status
            if (response.ok) {
                return response.json();
            } else {

                if (response.status == "404") return response.status

                throw new Error('Ответ сети был не в порядке. get_anime');
            }
        })
        .then(data => {
            if (data == "404") {
                sh_api.get_anime_ev.anime = data
                document.dispatchEvent(sh_api.get_anime_ev);
                return
            }

            sh_api.get_anime_ev.anime = data
            document.dispatchEvent(sh_api.get_anime_ev);
            // sh_api.Last_search = data
            // debug.log(sh_api.Last_search)
        })
        .catch(error => {

            console.error('Возникла проблема с операцией выборки get_anime:', error);
        });
}

sh_api.search = (seartch, censored=true) => {
    var url = `https://shikimori.one/api/animes?with_material_data=true&censored=${censored}&limit=50&search=${seartch}`

    fetch(url)
        .then(response => {
            sh_api.another.status = response.status
            if (response.ok) {
                return response.json();
            } else {

                if (response.status == "404") return response.status

                throw new Error('Ответ сети был не в порядке. Last_seartchr');
            }
        })
        .then(data => {
            if (data == "404") {
                sh_api.search_ev.search = data
                document.dispatchEvent(sh_api.search_ev);
                return
            }

            sh_api.search_ev.search = data
            document.dispatchEvent(sh_api.search_ev);
            // sh_api.Last_search = data
            // debug.log(sh_api.Last_search)
        })
        .catch(error => {

            console.error('Возникла проблема с операцией выборки Last_seartch:', error);
        });
}



///////////////////////

sh_api.DelUserRates = (id, sl) => {
    var url = `https://shikimori.one/api/v2/user_rates/${id}?access_token=${sh_api.getCookie("sh_access_token")}`
    fetch(url, {
        method: 'DELETE',

        headers: {
            "Authorization": `Bearer ${sh_api.getCookie("sh_access_token")}`,
            'User-Agent': 'Track Anime By DygDyg',
        },
        body: ``
    })
        .then(response => response.json())
        .then(data => {
            debug.log("DelUserRates", data)
        })
        .catch(error => console.error(error));
}






if (sh_api.code) sh_api.add_token()
















/*     
https://shikimori.one/api/doc/1.0
https://shikimori.one/api/doc/2.0
https://shikimori.one/oauth/applications
*/
