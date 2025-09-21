/*
* Перенаправляет с гита на новый сайт
*/
(function () {
    const redirectDomains = [
        "track-anime.github.io",
        "tr.dygdyg.ru",
    ];

    const currentDomain = window.location.hostname;

    if (redirectDomains.includes(currentDomain)) {
        const targetDomain = "track-anime.dygdyg.ru";
        if (currentDomain !== targetDomain) {
            const newUrl = window.location.protocol + "//" + targetDomain + window.location.pathname + window.location.search + window.location.hash;
            debugger;
            window.location.replace(newUrl);
        }
    }
})();

///////////////////////////////////////////////////////////////////////////////////////////////////////////