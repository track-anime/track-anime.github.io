<?php
header('Content-Type: application/json');

// Обработка OPTIONS-запроса для CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // Подключение к базе данных
    $db = new PDO('sqlite:../ta_user_base.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Таблица с настройками
    $db->exec("CREATE TABLE IF NOT EXISTS user_settings (
        user_id TEXT PRIMARY KEY,
        settings TEXT
    )");

    // Таблица для кэша токенов
    $db->exec("CREATE TABLE IF NOT EXISTS token_cache (
        access_token TEXT PRIMARY KEY,
        user_id TEXT,
        created_at INTEGER
    )");

    // Очистка старого кэша (старше 1 суток)
    $db->exec("DELETE FROM token_cache WHERE created_at < strftime('%s','now') - 86400");

    // Достаём заголовки
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';

    if (!$authHeader || !preg_match('/Bearer\s+(\S+)/', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(['error' => 'Authorization token is required']);
        exit;
    }

    $accessToken = $matches[1];
    $user_id = null;

    // Проверяем кэш
    $stmt = $db->prepare("SELECT user_id FROM token_cache WHERE access_token = :token");
    $stmt->execute([':token' => $accessToken]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row) {
        $user_id = $row['user_id'];
    } else {
        // Запрос к Shikimori API
        $ch = curl_init('https://shikimori.one/api/users/whoami');
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Authorization: Bearer $accessToken",
            "Accept: application/json"
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid or expired access token']);
            exit;
        }

        $userInfo = json_decode($response, true);
        if (!isset($userInfo['id'])) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to get user ID']);
            exit;
        }

        $user_id = $userInfo['id'];

        // Сохраняем в кэш
        $stmt = $db->prepare("REPLACE INTO token_cache (access_token, user_id, created_at) VALUES (:token, :user_id, :created_at)");
        $stmt->execute([
            ':token' => $accessToken,
            ':user_id' => $user_id,
            ':created_at' => time()
        ]);
    }

    // POST: Сохраняем настройки
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        if (!is_array($data)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid JSON data']);
            exit;
        }

        $stmt = $db->prepare("REPLACE INTO user_settings (user_id, settings) VALUES (:user_id, :settings)");
        $stmt->execute([
            ':user_id' => $user_id,
            ':settings' => json_encode($data)
        ]);

        echo json_encode(['status' => 'success']);
        exit;
    }

    // GET: Получаем настройки
    elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $db->prepare("SELECT settings FROM user_settings WHERE user_id = :user_id");
        $stmt->execute([':user_id' => $user_id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            echo $row['settings'];
        } else {
            echo json_encode(['message' => 'No settings found']);
        }
        exit;
    }

    // Метод не поддерживается
    else {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        exit;
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error', 'details' => $e->getMessage()]);
}
