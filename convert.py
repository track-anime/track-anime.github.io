from PIL import Image  # pip3 install pillow
import os

# Путь к папке с изображениями
input_folder = './bg'
output_folder = './converted'

# Создаем папку для сохранения, если она не существует
os.makedirs(output_folder, exist_ok=True)

# Перебираем все файлы в папке
for file_name in os.listdir(input_folder):
    if file_name.lower().endswith('.jpg'):
        input_path = os.path.join(input_folder, file_name)
        output_path = os.path.join(output_folder, file_name)

        # Открываем изображение, конвертируем и сохраняем в прогрессивном формате
        with Image.open(input_path) as img:
            img = img.convert('RGB')
            img.save(output_path, optimize=True, quality=100, progressive=True)

print("Конвертация завершена!")
