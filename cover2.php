<?php
/**
 * ================== COVER FETCHER ==================
 * Этот скрипт загружает и кэширует обложки аниме.
 *
 * GET параметры:
 * ---------------------------------------------------
 * id=12345       – ID аниме (поиск в Kodik API, WorldArt, Shikimori)
 * url=https://.. – Прямая ссылка на изображение
 * force=true     – Принудительно обновить обложку (иначе берётся из кеша)
 * debug=1        – Вместо картинки вернуть JSON-отчёт
 * resize_all=1   – Пройтись по всем обложкам в /cover/ и уменьшить до max_height
 *
 * Источники:
 * 1. url=…        – прямая ссылка
 * 2. Kodik API    – worldart_link или material_data.poster_url
 * 3. WorldArt     – парсинг страницы по worldart_link
 * 4. Shikimori    – https://shikimori.one/api/animes/{id}
 *                   (original > preview > x96 > x48, кроме "missing_*")
 *
 * Кеш:
 *  - Сохраняются в /cover/{id}.webp
 *  - Повторные запросы → кеш (если нет force=true)
 *  - Кеш браузера через Cache-Control/ETag/Last-Modified
 *
 * Масштабирование:
 *  - Если высота > max_height → уменьшает с сохранением пропорций
 * ===================================================
 */

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

set_time_limit(300);
ini_set('max_execution_time', 300);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

// ================== НАСТРОЙКИ ==================
$quality = 70;       // Качество WebP (0–100)
$max_height = 450;   // Максимальная высота обложки
$cache_lifetime = 60 * 60 * 24 * 7; // 7 дней кеша браузера

$tokens = [
    '7f129085d2f372833fcc5e2116e4d0a4',
    'd046caa991d8b228f8d0a1a2f990cce5',
    '465c15438e7799bee14ea8965dc6e845',
    '3bd0a27dfccd284c54f4889f4a7d6453',
    '54eb773d434f45f4c9bb462bc3ce0342',
    '5806763453666325d912b64d6031b627',
    '45c53578f11ecfb74e31267b634cc6a8',
    'd884e7fbe01111ee8c84d78cdc023249',
    '694c5bae37d82efc1da0403421851f5d',
    '2d343183c2f3cfb3c557e409460875e2',
    '41dd95f84c21719b09d6c71182237a25',
    '8e349c0c9d4fbf42a2243c7e87b9ccd8'
];
// ===============================================

$id    = $_GET['id']   ?? '';
$url   = $_GET['url']  ?? '';
$force = isset($_GET['force']) && $_GET['force'] === 'true';
$debug = isset($_GET['debug']) && $_GET['debug'] === '1';
$resize_all = isset($_GET['resize_all']) && $_GET['resize_all'] === '1';

if (!file_exists('cover')) {
    mkdir('cover', 0755, true);
}

// === Массовое уменьшение уже сохранённых обложек ===
if ($resize_all) {
    $coverDir = __DIR__ . '/../cover/';
    $icons = glob($coverDir . "/*.webp");
    $processed = [];
    $skipped = [];

    foreach ($icons as $icon) {
        [$w, $h] = getimagesize($icon);
        if ($h > $max_height) {
            $data = file_get_contents($icon);
            if ($data && saveImage($data, $icon, $quality, $max_height)) {
                [$nw, $nh] = getimagesize($icon);
                $processed[] = [
                    "file"     => basename($icon),
                    "new_size" => filesize($icon),
                    "width"    => $nw,
                    "height"   => $nh
                ];
            }
        } else {
            $skipped[] = [
                "file"   => basename($icon),
                "width"  => $w,
                "height" => $h
            ];
        }
    }

    header('Content-Type: application/json');
    echo json_encode([
        "status"    => "ok",
        "processed" => $processed,
        "skipped"   => $skipped,
        "count"     => [
            "processed" => count($processed),
            "skipped"   => count($skipped),
            "total"     => count($icons)
        ]
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

function resolveAbsoluteUrl($baseUrl, $relativeUrl) {
    if (preg_match('/^https?:\/\//i', $relativeUrl)) {
        return $relativeUrl;
    }
    $base = parse_url($baseUrl);
    $scheme = $base['scheme'] ?? 'http';
    $host   = $base['host']   ?? '';
    $path   = isset($base['path']) ? dirname($base['path']) : '';
    if (strpos($relativeUrl, '/') === 0) {
        return "$scheme://$host$relativeUrl";
    }
    $fullPath = rtrim($path, '/') . '/' . ltrim($relativeUrl, '/');
    $fullPath = preg_replace('#/[^/]+/\.\./#', '/', $fullPath);
    $fullPath = preg_replace('#/\./#', '/', $fullPath);
    return "$scheme://$host$fullPath";
}

function read_img($imagePath, $cache_lifetime) {
    $mimeType = mime_content_type($imagePath);
    $lastModified = gmdate('D, d M Y H:i:s', filemtime($imagePath)) . ' GMT';
    $etag = '"' . md5_file($imagePath) . '"';

    header("Content-Type: $mimeType");
    header("Cache-Control: public, max-age=$cache_lifetime, immutable");
    header("Expires: " . gmdate("D, d M Y H:i:s", time() + $cache_lifetime) . " GMT");
    header("Last-Modified: $lastModified");
    header("ETag: $etag");

    if ((isset($_SERVER['HTTP_IF_MODIFIED_SINCE']) && $_SERVER['HTTP_IF_MODIFIED_SINCE'] === $lastModified) ||
        (isset($_SERVER['HTTP_IF_NONE_MATCH']) && trim($_SERVER['HTTP_IF_NONE_MATCH']) === $etag)) {
        http_response_code(304);
        exit;
    }

    readfile($imagePath);
    exit;
}

function fetchUrl($url, $referer = null) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');

    $headers = [
        "Accept: image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        "Accept-Language: en-US,en;q=0.9"
    ];
    if ($referer) {
        $headers[] = "Referer: $referer";
    }
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return [$response, $httpCode];
}

function saveImage($imageData, $imagePath, $quality, $max_height) {
    $src = imagecreatefromstring($imageData);
    if (!$src) {
        return false;
    }

    $width  = imagesx($src);
    $height = imagesy($src);

    if ($height > $max_height) {
        $newHeight = $max_height;
        $newWidth  = intval($width * ($newHeight / $height));

        $dst = imagecreatetruecolor($newWidth, $newHeight);
        imagecopyresampled($dst, $src, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

        $result = imagewebp($dst, $imagePath, $quality);
        imagedestroy($dst);
    } else {
        $result = imagewebp($src, $imagePath, $quality);
    }

    imagedestroy($src);
    return $result;
}

function getWorldArtLink($id, $imagePath, $quality, $max_height, &$source) {
    global $tokens;
    $token = $tokens[array_rand($tokens)];

    $myurl = "https://kodikapi.com/search?token={$token}&with_material_data=true&shikimori_id=" . $id;
    list($json, $code) = fetchUrl($myurl);
    if ($code !== 200 || !$json) {
        return null;
    }
    $data = json_decode($json, true);

    if (isset($data['results'][0]['worldart_link'])) {
        return $data['results'][0]['worldart_link'];
    } elseif (isset($data['results'][0]['material_data']['poster_url'])) {
        $posterUrl = $data['results'][0]['material_data']['poster_url'];
        list($imageData, $httpCode) = fetchUrl($posterUrl, $posterUrl);
        if ($httpCode === 200 && $imageData) {
            if (saveImage($imageData, $imagePath, $quality, $max_height)) {
                $source = "kodik_poster_url";
            }
        }
        return null;
    }
    return null;
}

function getShikimoriPoster($id, $imagePath, $quality, $max_height, &$source) {
    $apiUrl = "https://shikimori.one/api/animes/" . $id;
    list($json, $code) = fetchUrl($apiUrl, "https://shikimori.one/");
    if ($code !== 200 || !$json) {
        return false;
    }
    $data = json_decode($json, true);
    if (!isset($data['image'])) {
        return false;
    }

    $posterPath = $data['image']['original']
        ?? $data['image']['preview']
        ?? $data['image']['x96']
        ?? $data['image']['x48']
        ?? null;

    if ($posterPath && strpos($posterPath, '/assets/globals/missing_') === 0) {
        return false;
    }

    if ($posterPath) {
        $posterUrl = "https://shikimori.one" . $posterPath;
        list($imageData, $httpCode) = fetchUrl($posterUrl, "https://shikimori.one/");
        if ($httpCode === 200 && $imageData) {
            if (saveImage($imageData, $imagePath, $quality, $max_height)) {
                $source = "shikimori";
            }
            return true;
        }
    }
    return false;
}

// === Статистика при пустом запросе ===
if (empty($id) && empty($url)) {
    $coverDir = __DIR__ . '/../cover/';
    $icons = glob($coverDir . "/*.webp");
    $totalSize = 0;
    foreach ($icons as $icon) {
        $totalSize += filesize($icon);
    }
    header('Content-Type: application/json');
    echo json_encode([
        'count' => count($icons),
        'total_size_mb' => round($totalSize / (1024 * 1024), 2)
    ]);
    exit;
}

$imagePath = __DIR__ . '/../cover/' . $id . ".webp";
$source = "none";

// === Если файл есть и force не указан — отдать ===
if (file_exists($imagePath) && !$force) {
    if ($debug) {
        header('Content-Type: application/json');
        echo json_encode([
            "status"  => "cached",
            "source"  => "cache",
            "file"    => $imagePath,
            "size"    => filesize($imagePath),
            "quality" => $GLOBALS['quality']
        ]);
        exit;
    }
    read_img($imagePath, $cache_lifetime);
}

// === Попытка скачать по URL ===
$url_failed = false;
if (!empty($url)) {
    list($imageData, $httpCode) = fetchUrl($url, $url);
    if ($httpCode === 200 && $imageData) {
        if (saveImage($imageData, $imagePath, $quality, $max_height)) {
            $source = "url";
            if ($debug) {
                [$w, $h] = getimagesize($imagePath);
                header('Content-Type: application/json');
                echo json_encode([
                    "status"  => "ok",
                    "source"  => $source,
                    "file"    => $imagePath,
                    "size"    => filesize($imagePath),
                    "width"   => $w,
                    "height"  => $h,
                    "http"    => $httpCode,
                    "quality" => $GLOBALS['quality']
                ]);
                exit;
            }
            read_img($imagePath, $cache_lifetime);
        }
    }
    $url_failed = true;
}

// === Попытка через Kodik/WorldArt ===
if (!empty($id) && ($url_failed || empty($url))) {
    $worldArtUrl = getWorldArtLink($id, $imagePath, $quality, $max_height, $source);
    if ($worldArtUrl) {
        list($html, $httpCode) = fetchUrl($worldArtUrl);
        if ($httpCode === 200 && $html) {
            $dom = new DOMDocument();
            libxml_use_internal_errors(true);
            $dom->loadHTML($html);
            libxml_clear_errors();
            $xpath = new DOMXPath($dom);
            $imageNode = $xpath->query('//tr/td/center/a/img');
            if ($imageNode->length == 0) {
                $imageNode = $xpath->query('//tr/td/a/img');
            }
            if ($imageNode->length > 0) {
                $imageSrc = resolveAbsoluteUrl($worldArtUrl, $imageNode->item(0)->getAttribute('src'));
                list($imageData, $httpCode) = fetchUrl($imageSrc, $worldArtUrl);
                if ($httpCode === 200 && $imageData) {
                    if (saveImage($imageData, $imagePath, $quality, $max_height)) {
                        $source = "worldart";
                        if ($debug) {
                            [$w, $h] = getimagesize($imagePath);
                            header('Content-Type: application/json');
                            echo json_encode([
                                "status"  => "ok",
                                "source"  => $source,
                                "file"    => $imagePath,
                                "size"    => filesize($imagePath),
                                "width"   => $w,
                                "height"  => $h,
                                "http"    => $httpCode,
                                "quality" => $GLOBALS['quality']
                            ]);
                            exit;
                        }
                        read_img($imagePath, $cache_lifetime);
                    }
                }
            }
        }
    }
    // === Если не нашли — пробуем Shikimori ===
    if (!file_exists($imagePath)) {
        if (getShikimoriPoster($id, $imagePath, $quality, $max_height, $source)) {
            if ($debug) {
                [$w, $h] = getimagesize($imagePath);
                header('Content-Type: application/json');
                echo json_encode([
                    "status"  => "ok",
                    "source"  => $source,
                    "file"    => $imagePath,
                    "size"    => filesize($imagePath),
                    "width"   => $w,
                    "height"  => $h,
                    "quality" => $GLOBALS['quality']
                ]);
                exit;
            }
            read_img($imagePath, $cache_lifetime);
        }
    }
}

// === Если не удалось найти обложку ===
if ($force && file_exists($imagePath)) {
    unlink($imagePath);
    $source = "deleted_old_cache";
}

http_response_code(404);
if ($debug) {
    header('Content-Type: application/json');
    echo json_encode([
        "status"  => "error",
        "message" => "Image not found",
        "source"  => $source
    ]);
} else {
    echo "Image not found";
}
exit;
