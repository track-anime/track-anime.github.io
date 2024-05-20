var sh_api = {}

sh_api.url_get = new URL(window.location.href)
sh_api.UserData = {}
sh_api.Favorits = {}
sh_api.authorize = false
sh_api.authorize_ev = new Event("authorize", { bubbles: true })
sh_api.code = sh_api.url_get.searchParams.get('code')
sh_api.status_lable = [
    "watching",
    "completed",
    "dropped",
    "on_hold",
    "planned",
    "rewatching",
]
sh_api.status_lable_ru = [
    "смотрю",
    "просмотренно",
    "брошено",
    "отложено",
    "запланировано",
    "пересматриваю",
]

/* document.addEventListener("authorize", function (e) { // (1)
    console.log("authorize", e)

}); */


sh_api.getCookie = (name) => {
    var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

sh_api.get_key = () => {
    window.open(`https://shikimori.one/oauth/authorize?client_id=aBohwwIpPXeCgSlo1xorfHKPaRBsdpW0_MMF8S-7SWA&redirect_uri=${window.location.origin}${window.location.pathname}&response_type=code`, "_self");
    return
    code = sh_api.url_get.searchParams.get('code')
    if (!code && !sh_api.getCookie("sh_refresh_token")) {
    }
}

sh_api.add_token = () => {

    if (sh_api.getCookie("sh_access_token")) {
        return sh_api.getCookie("sh_access_token")
    }

    code = sh_api.url_get.searchParams.get('code')
    if (!code && !sh_api.getCookie("sh_refresh_token")) {
        return "no_key"
        window.open(`https://shikimori.one/oauth/authorize?client_id=aBohwwIpPXeCgSlo1xorfHKPaRBsdpW0_MMF8S-7SWA&redirect_uri=${window.location.origin}${window.location.pathname}&response_type=code`, "_self");
        return
    }

    if (!sh_api.getCookie("sh_access_token") && sh_api.getCookie("sh_refresh_token")) {
        console.log("reload_token")
        sh_api.refresh_token()

        return
    }

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
            console.log("get", data);
            document.cookie = `sh_access_token=${data.access_token}; path=/; max-age=${data.expires_in};`
            document.cookie = `sh_refresh_token=${data.refresh_token}; path=/; max-age=9999999999999999999;`

            sh_api.url_get.searchParams.delete("code")
            window.history.pushState({}, '', sh_api.url_get);

            // if (data.error == "invalid_grant") window.open(`https://shikimori.one/oauth/authorize?client_id=aBohwwIpPXeCgSlo1xorfHKPaRBsdpW0_MMF8S-7SWA&redirect_uri=${window.location.origin}${window.location.pathname}&response_type=code`, "_self");
            // location.reload()
            sh_api.authorize = true
            sh_api.get_user()
        })
        .catch(error => console.error(error));
}
sh_api.logout = () => {
    document.cookie = `sh_access_token=""; path=/; max-age=-1;`
    document.cookie = `sh_refresh_token=""; path=/; max-age=-1;`
    document.cookie = `_kawai_session=""; path=/; max-age=-1;`
    location.reload()
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
            console.log("rf", data);
            document.cookie = `sh_access_token=${data.access_token}; path=/; max-age=${data.expires_in}`
            document.cookie = `sh_refresh_token=${data.refresh_token}; path=/;`
            if (data.error == "invalid_grant") window.open(`https://shikimori.one/oauth/authorize?client_id=aBohwwIpPXeCgSlo1xorfHKPaRBsdpW0_MMF8S-7SWA&redirect_uri=${window.location.origin}${window.location.pathname}&response_type=code`, "_self");
            sh_api.authorize = true
            sh_api.get_user()
            // location.reload()
        })
        .catch(error => console.error(error));

}

sh_api.get_user = (user) => {
    if (!sh_api.getCookie("sh_access_token")) {
        const ot = sh_api.refresh_token()
        if (ot == "No_Authorize") return ot
    }
    const url = `https://shikimori.one/api/users/${user ? user : "whoami"}?access_token=${sh_api.getCookie("sh_access_token")}`
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Ответ сети был не в порядке. get_user');
            }
        })
        .then(data => {
            sh_api.authorize = true
            console.log("user_data", data);
            sh_api.UserData = data
            sh_api.get_favorit(user)
        })
        .catch(error => {
            console.error('Возникла проблема с операцией выборки get_user:', error);
        });


    // document.cookie = getCookie("KeyTab") ? `` : `KeyTab=${KeyTab}; path=/; max-age=10`
}

sh_api.get_favorit = (sh_user) => {
    if (!sh_api.getCookie("sh_access_token")) {
        const ot = sh_api.refresh_token()
        if (ot == "No_Authorize") return ot
    }
    fetch(`https://shikimori.one/api/users/${sh_user ? sh_user : sh_api.UserData.id}/anime_rates?limit=5000&access_token=${sh_api.getCookie("sh_access_token")}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Ответ сети был не в порядке. get_favorit');
            }
        })
        .then(data => {
            sh_api.authorize = true
            console.log("anime_rates", data);
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

        })
        .catch(error => {
            console.error('Возникла проблема с операцией выборки get_favorit:', error);
        });
}

sh_api.AddUserRates = (id, sl) => {

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
            console.log("AddUserRates", data)
            sh_api.get_favorit()
        })
        .catch(error => console.error(error));
}

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
            console.log("DelUserRates", data)
        })
        .catch(error => console.error(error));
}






if (sh_api.code) sh_api.add_token()
