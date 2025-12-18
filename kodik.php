<?php
// Устанавливаем заголовок Content-Type
header('Content-Type: application/json; charset=UTF-8');

// Массив токенов для случайного выбора
$tokens = [
    '0aff7fc9ddf9e8736ff28bdabedd89f1'
];
// $tokens = [
//     '7f129085d2f372833fcc5e2116e4d0a4',
//     'd046caa991d8b228f8d0a1a2f990cce5',
//     '465c15438e7799bee14ea8965dc6e845',
//     '3bd0a27dfccd284c54f4889f4a7d6453',
//     '54eb773d434f45f4c9bb462bc3ce0342',
//     '5806763453666325d912b64d6031b627',
//     '45c53578f11ecfb74e31267b634cc6a8',
//     'd884e7fbe01111ee8c84d78cdc023249',
//     '694c5bae37d82efc1da0403421851f5d',
//     '2d343183c2f3cfb3c557e409460875e2',
//     '41dd95f84c21719b09d6c71182237a25',
//     '8e349c0c9d4fbf42a2243c7e87b9ccd8'
// ];

// Выбираем случайный токен
$token = $tokens[array_rand($tokens)];

// Список разрешенных целевых эндпоинтов
$allowed_endpoints = [
    'https://kodikapi.com/search',
    'https://kodikapi.com/translations/v2',
    'https://kodikapi.com/list',
    'https://dumps.kodik.biz/calendar.json'
];

// Обработка предварительного запроса OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Получаем метод (эндпоинт) из GET или POST параметра
$method = isset($_GET['method']) ? trim($_GET['method']) : (isset($_POST['method']) ? trim($_POST['method']) : '');

// Формируем целевой URL
$target_url = '';
switch ($method) {
    case 'search':
        $target_url = 'https://kodikapi.com/search';
        break;
    case 'calendar':
        $target_url = 'https://dumps.kodik.biz/calendar.json';
        break;
    case 'translations':
        $target_url = 'https://kodikapi.com/translations/v2';
        break;
    case 'list':
        $target_url = 'https://kodikapi.com/list';
        break;
    default:
        send_error('Неверный метод. Доступные методы: search, translations, list');
}

// Проверяем, что целевой URL входит в разрешенный список
if (!in_array($target_url, $allowed_endpoints)) {
    send_error('Недопустимый целевой URL');
}

// Функция для отправки ошибок
function send_error($message, $code = 400) {
    http_response_code($code);
    echo json_encode(['error' => $message]);
    exit;
}

// Функция для выполнения API-запроса
function make_api_request($url, $params = [], $method = 'GET') {
    $ch = curl_init();
    
    if ($method === 'GET') {
        $url .= '?' . http_build_query($params);
    }
    
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_ENCODING, 'gzip, deflate'); // Поддержка сжатия
    
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
    }
    
    // Передаем заголовки клиента
    $headers = [];
    foreach (getallheaders() as $name => $value) {
        if (!in_array(strtolower($name), ['host', 'connection', 'accept-encoding'])) {
            $headers[] = "$name: $value";
        }
    }
    // Добавляем заголовок для принятия сжатого ответа
    $headers[] = 'Accept-Encoding: gzip, deflate';
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
    if ($response === false || $http_code >= 400) {
        send_error('Ошибка API: ' . curl_error($ch) . ' (HTTP ' . $http_code . ')', 500);
    }
    
    curl_close($ch);
    
    // Проверяем, является ли ответ сжатым (gzip)
    if (substr($response, 0, 2) === "\x1f\x8b") {
        $response = gzdecode($response);
        if ($response === false) {
            send_error('Ошибка декодирования gzip-ответа', 500);
        }
    }
    
    return $response;
}

// Собираем все параметры (GET или POST)
$params = $_SERVER['REQUEST_METHOD'] === 'POST' ? $_POST : $_GET;
unset($params['method']); // Удаляем параметр method
$params['token'] = $token; // Добавляем случайный токен

// Определяем метод запроса
$request_method = $_SERVER['REQUEST_METHOD'];

// Выполняем запрос
$response = make_api_request($target_url, $params, $request_method);

// Декодируем JSON-ответ
$response_data = json_decode($response, true);

// Определяем URL текущего сервера
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$server_url = $protocol . '://' . $_SERVER['HTTP_HOST'] . '/kodik.php?method=' . $method;

// Проверяем наличие prev_page и next_page и заменяем URL
if (isset($response_data['prev_page']) && !empty($response_data['prev_page'])) {
    $response_data['prev_page'] = str_replace($target_url."?", $server_url."&", $response_data['prev_page']);
    // Удаляем параметр token из prev_page
    foreach ($tokens as $t) {
        $response_data['prev_page'] = str_replace("&token=$t", "", $response_data['prev_page']);
    }
}
if (isset($response_data['next_page']) && !empty($response_data['next_page'])) {
    $response_data['next_page'] = str_replace($target_url."?", $server_url."&", $response_data['next_page']);
    // Удаляем параметр token из next_page
    foreach ($tokens as $t) {
        $response_data['next_page'] = str_replace("&token=$t", "", $response_data['next_page']);
    }
}

// Кодируем ответ обратно в JSON
$response = json_encode($response_data);

// Выводим ответ
echo $response;
?>