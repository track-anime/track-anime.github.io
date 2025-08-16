<?php
// Читаем содержимое файла index.htm
$content = file_get_contents('index.htm');
$debug_script = "<div></div>";
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
            $content = preg_replace('/<title>[^<]*<\/title>/i', '<title>TA: ['.$data['kind']."] ".$data['russian'].'</title>', $content);


            $content = preg_replace('/<meta\s+name="title"\s+content="[^"]*"\s*\/?>/i', '<meta og:title" content="TA: ['.$data['kind']."] ".$data['russian'].'">', $content);
            $content = preg_replace('/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i', '<meta og:title" content="TA: ['.$data['kind']."] ".$data['russian'].'">', $content);
            $content = preg_replace('/<meta\s+property="twitter:title"\s+content="[^"]*"\s*\/?>/i', '<meta twitter:title" content="TA: ['.$data['kind']."] ".$data['russian'].'">', $content);
            
            $content = preg_replace('/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i', '<meta name="description" content="['.$data['kind']."] ".$data['russian'].'">', $content);
            $content = preg_replace('/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i', '<meta property="og:description" content="['.$data['kind']."] ".$data['russian'].'">', $content);
            $content = preg_replace('/<meta\s+property="twitter:description"\s+content="[^"]*"\s*\/?>/i', '<meta property="twitter:description" content="['.$data['kind']."] ".$data['russian'].'">', $content);

            $content = preg_replace('/<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i', '<meta property="og:image" content="https://server.dygdyg.ru/cover2.php?id='.$shikimori_id.'">', $content);
            $content = preg_replace('/<meta\s+property="twitter:image"\s+content="[^"]*"\s*\/?>/i', '<meta property="twitter:image" content="https://server.dygdyg.ru/cover2.php?id='.$shikimori_id.'">', $content);
        }
    }
    
    
    // Вставляем отладочный скрипт перед закрывающим тегом </body>
    $content = str_replace('</body>', $debug_script . '</body>', $content);
}

// Выводим содержимое (измененное или оригинальное)
echo $content;
?>