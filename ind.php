<?php
// Читаем содержимое файла index.htm
$content = file_get_contents('index.htm');

// Новый мета-тег для замены
$new_meta_tag = '<meta charset="UTF-8" name="viewport" content="width=device-width, initial-scale=1.0">';

// Регулярное выражение для поиска всех мета-тегов в секции <head>
$pattern = '/<head>(.*?)<meta[^>]*>(.*?)<\/head>/is';

// Заменяем все мета-теги на новый
$result = preg_replace($pattern, "<head>$1$new_meta_tag$2</head>", $content);

// Устанавливаем заголовок для правильного отображения HTML
header('Content-Type: text/html; charset=UTF-8');

// Выводим измененное содержимое
echo $result;
?>