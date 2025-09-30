import os
import sys
import uuid
from PIL import Image

def convert_to_webp(folder_path):
    supported_ext = (".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".gif")
    if not os.path.isdir(folder_path):
        print(f"Папка '{folder_path}' не найдена.")
        return
    
    for root, _, files in os.walk(folder_path):
        for file in files:
            if file.lower().endswith(supported_ext):
                full_path = os.path.join(root, file)
                try:
                    with Image.open(full_path) as img:
                        img = img.convert("RGB")
                        new_name = str(uuid.uuid4()) + ".webp"
                        new_path = os.path.join(root, new_name)
                        img.save(new_path, "WEBP", quality=80)
                        print(f"✅ {file} → {new_name}")
                except Exception as e:
                    print(f"Ошибка при конвертации {file}: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        target_folder = sys.argv[1]
    else:
        target_folder = os.path.dirname(os.path.abspath(__file__))  # папка, где лежит сам скрипт

    convert_to_webp(target_folder)
