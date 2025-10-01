return
var covers_base = []
try {
    const response = await fetch('covers.json');
    if (!response.ok) {
        throw new Error("!!!!!!!!!!!!!!!", `HTTP error! status: ${response.status}`);
    }
    covers_base = await response.json();
    return covers_base;
} catch (error) {
    console.error('Ошибка загрузки данных:', error);
}

function getCover(id) {

    if (covers_base[id] == undefined) {
        debug.log("getCover", id, `https://shikimori.one/animes/${id}`)
        sendWebhookMessageNoCover(id)
        return "404_static.png"
    }
    return covers_base[id]
}