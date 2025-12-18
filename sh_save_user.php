<?php
// Обход CORS
header('Content-Type: application/json');
// header('Access-Control-Allow-Origin: *');
// header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Обработка OPTIONS-запроса для CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Подключение к SQLite базе данных
try {
    $db = new PDO('sqlite:../sh_save_user.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Создание таблицы, если она не существует
    $db->exec("
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            nickname TEXT NOT NULL,
            avatar TEXT,
            image TEXT,
            last_online_at TEXT,
            url TEXT,
            name TEXT,
            sex TEXT,
            website TEXT,
            birth_on TEXT,
            full_years INTEGER,
            locale TEXT,
            raitnig_user INTEGER
        )
    ");
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    exit;
}

// Обработка запросов
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Получаем данные из POST-запроса
    $input = json_decode(file_get_contents('php://input'), true);

    // Проверяем наличие обязательных полей
    $required_fields = ['id', 'nickname', 'avatar', 'image', 'last_online_at', 'url', 'locale', 'raitnig_user'];
    foreach ($required_fields as $field) {
        if (!isset($input[$field])) {
            http_response_code(400);
            echo json_encode(['error' => "Missing required field: $field"]);
            exit;
        }
    }

    // Подготовка данных для сохранения
    $user_data = [
        'id' => (int)$input['id'],
        'nickname' => $input['nickname'],
        'avatar' => $input['avatar'],
        'image' => $input['image'],
        'last_online_at' => $input['last_online_at'],
        'url' => $input['url'],
        'name' => isset($input['name']) ? $input['name'] : null,
        'sex' => isset($input['sex']) ? $input['sex'] : null,
        'website' => isset($input['website']) ? $input['website'] : null,
        'birth_on' => isset($input['birth_on']) ? $input['birth_on'] : null,
        'full_years' => isset($input['full_years']) ? (int)$input['full_years'] : null,
        'locale' => $input['locale'],
        'raitnig_user' => (int)$input['raitnig_user']
    ];

    try {
        // Подготовка SQL-запроса для вставки или обновления данных
        $sql = "
            INSERT OR REPLACE INTO users (
                id, nickname, avatar, image, last_online_at, url, name, sex, 
                website, birth_on, full_years, locale, raitnig_user
            ) VALUES (
                :id, :nickname, :avatar, :image, :last_online_at, :url, :name, :sex, 
                :website, :birth_on, :full_years, :locale, :raitnig_user
            )
        ";

        $stmt = $db->prepare($sql);
        
        // Привязка параметров
        $stmt->bindValue(':id', $user_data['id'], PDO::PARAM_INT);
        $stmt->bindValue(':nickname', $user_data['nickname'], PDO::PARAM_STR);
        $stmt->bindValue(':avatar', $user_data['avatar'], PDO::PARAM_STR);
        $stmt->bindValue(':image', json_encode($user_data['image']), PDO::PARAM_STR);
        $stmt->bindValue(':last_online_at', $user_data['last_online_at'], PDO::PARAM_STR);
        $stmt->bindValue(':url', $user_data['url'], PDO::PARAM_STR);
        $stmt->bindValue(':name', $user_data['name'], PDO::PARAM_STR);
        $stmt->bindValue(':sex', $user_data['sex'], PDO::PARAM_STR);
        $stmt->bindValue(':website', $user_data['website'], PDO::PARAM_STR);
        $stmt->bindValue(':birth_on', $user_data['birth_on'], PDO::PARAM_STR);
        $stmt->bindValue(':full_years', $user_data['full_years'], PDO::PARAM_INT);
        $stmt->bindValue(':locale', $user_data['locale'], PDO::PARAM_STR);
        $stmt->bindValue(':raitnig_user', $user_data['raitnig_user'], PDO::PARAM_INT);

        // Выполнение запроса
        $stmt->execute();

        // Получение всех пользователей после сохранения
        $result = $db->query("SELECT * FROM users");
        $users = $result->fetchAll(PDO::FETCH_ASSOC);

        // Декодирование JSON-поля image для каждого пользователя
        foreach ($users as &$user) {
            $user['image'] = json_decode($user['image'], true);
        }

        // Ответ с данными всех пользователей
        http_response_code(200);
        echo json_encode(['message' => 'User data saved successfully', 'users' => $users]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }

} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Получение всех пользователей
        $result = $db->query("SELECT * FROM users");
        $users = $result->fetchAll(PDO::FETCH_ASSOC);

        // Декодирование JSON-поля image для каждого пользователя
        foreach ($users as &$user) {
            $user['image'] = json_decode($user['image'], true);
        }

        // Ответ с данными всех пользователей
        http_response_code(200);
        echo json_encode(['users' => $users]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }

} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
}
?>