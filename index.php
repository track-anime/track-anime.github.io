<?php
// Читаем содержимое файла index.htm
$content = file_get_contents('index.htm');
$debug_script = "<div>111</div>";
// Проверяем наличие GET параметра shikimori_id
if (isset($_GET['shikimori_id']) && !empty($_GET['shikimori_id'])) {
    // Получаем shikimori_id из GET параметра
    $shikimori_id = filter_var($_GET['shikimori_id'], FILTER_SANITIZE_NUMBER_INT);
    
    // Формируем URL для API запроса
    $api_url = "https://shikimori.one/api/animes/{$shikimori_id}";
    
    // Выполняем GET запрос к API
    $response = @file_get_contents($api_url);
    
    if ($response !== false) {
        // Декодируем JSON ответ
        $data = json_decode($response, true);
        // Проверяем, есть ли поле russian в ответе
        if (isset($data['russian']) && !empty($data['russian'])) {

            // Заменяем существующий метатег description на новый
            $content = preg_replace('/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i', '<meta name="description" content="['.$data['kind']."] ".$data['russian'].'">', $content);
            $content = preg_replace('/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i', '<meta property="og:description" content="['.$data['kind']."] ".$data['russian'].'">', $content);
            $content = preg_replace('/<meta\s+property="twitter:description"\s+content="[^"]*"\s*\/?>/i', '<meta property="twitter:description" content="['.$data['kind']."] ".$data['russian'].'">', $content);
            $content = preg_replace('/<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i', '<meta property="og:image" content="https://server.dygdyg.ru/cover2.php?id='.$shikimori_id.'">', $content);
            $content = preg_replace('/<meta\s+property="twitter:image"\s+content="[^"]*"\s*\/?>/i', '<meta property="twitter:image" content="https://server.dygdyg.ru/cover2.php?id='.$shikimori_id.'">', $content);
        }
        // Добавляем JavaScript для вывода $response в консоль браузера
        $debug_script = '<script>console.log(111,"' . $data['russian'] . '");</script>';
    }
    
    
    // Вставляем отладочный скрипт перед закрывающим тегом </body>
    $content = str_replace('</body>', $debug_script . '</body>', $content);
}

// Выводим содержимое (измененное или оригинальное)
echo $content;
?>