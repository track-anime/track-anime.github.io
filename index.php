<?php
// Читаем содержимое файла index.htm
$content = file_get_contents('index.htm');
$debug_script = "<div></div>";

$baseUrl = "https://track-anime.dygdyg.ru"; // поправь если другой домен
$currentUrl = $baseUrl . $_SERVER['REQUEST_URI'];

if (isset($_GET['shikimori_id']) && !empty($_GET['shikimori_id'])) {
    $shikimori_id = filter_var($_GET['shikimori_id'], FILTER_SANITIZE_NUMBER_INT);
    $api_url = "https://shikimori.one/api/animes/{$shikimori_id}";
    $response = @file_get_contents($api_url);

    if ($response !== false) {
        $data = json_decode($response, true);

        if (isset($data['russian']) && !empty($data['russian'])) {
            $title = "TA: [{$data['kind']}] {$data['russian']}";
            $desc  = !empty($data['description']) 
                        ? strip_tags($data['description']) 
                        : "[{$data['kind']}] {$data['russian']} — описание отсутствует";
            $img   = "{$baseUrl}/cover2.php?id={$shikimori_id}";

            // Title
            $content = preg_replace('/<title>[^<]*<\/title>/i', "<title>{$title}</title>", $content);

            // Title tags
            $content = preg_replace('/<meta\s+name="title".*?>/i',
                "<meta name=\"title\" content=\"{$title}\">", $content);
            $content = preg_replace('/<meta\s+property="og:title".*?>/i',
                "<meta property=\"og:title\" content=\"{$title}\">", $content);
            $content = preg_replace('/<meta\s+property="twitter:title".*?>/i',
                "<meta property=\"twitter:title\" content=\"{$title}\">", $content);

            // Description
            $content = preg_replace('/<meta\s+name="description".*?>/i',
                "<meta name=\"description\" content=\"{$desc}\">", $content);
            $content = preg_replace('/<meta\s+property="og:description".*?>/i',
                "<meta property=\"og:description\" content=\"{$desc}\">", $content);
            $content = preg_replace('/<meta\s+property="twitter:description".*?>/i',
                "<meta property=\"twitter:description\" content=\"{$desc}\">", $content);

            // Images
            $content = preg_replace('/<meta\s+property="og:image".*?>/i',
                "<meta property=\"og:image\" content=\"{$img}\">", $content);
            $content = preg_replace('/<meta\s+property="twitter:image".*?>/i',
                "<meta property=\"twitter:image\" content=\"{$img}\">", $content);

            // Canonical
            if (!preg_match('/<link\s+rel="canonical"/i', $content)) {
                $content = preg_replace('/<\/head>/i',
                    "<link rel=\"canonical\" href=\"{$currentUrl}\">\n</head>", $content);
            } else {
                $content = preg_replace('/<link\s+rel="canonical".*?>/i',
                    "<link rel=\"canonical\" href=\"{$currentUrl}\">", $content);
            }

            // og:url
            if (!preg_match('/<meta\s+property="og:url"/i', $content)) {
                $content = preg_replace('/<\/head>/i',
                    "<meta property=\"og:url\" content=\"{$currentUrl}\">\n</head>", $content);
            } else {
                $content = preg_replace('/<meta\s+property="og:url".*?>/i',
                    "<meta property=\"og:url\" content=\"{$currentUrl}\">", $content);
            }

            // twitter:card
            if (!preg_match('/<meta\s+name="twitter:card"/i', $content)) {
                $content = preg_replace('/<\/head>/i',
                    "<meta name=\"twitter:card\" content=\"summary_large_image\">\n</head>", $content);
            } else {
                $content = preg_replace('/<meta\s+name="twitter:card".*?>/i',
                    "<meta name=\"twitter:card\" content=\"summary_large_image\">", $content);
            }
        }
    }

    // Отладочный блок
    $content = str_replace('</body>', $debug_script . '</body>', $content);
}

echo $content;

?>