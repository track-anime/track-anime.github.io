@echo off
chcp 1251 >nul
set "appdata_dir=%APPDATA%\DiscordRPC"
set "exe_file=%appdata_dir%\discord-rpc-server.exe"
set "vbs_launcher=%appdata_dir%\start_hidden.vbs"
set "protocol_name=rtc"
set "protocol_reg_key=HKCR\%protocol_name%"
set "startup_reg_key=HKCU\Software\Microsoft\Windows\CurrentVersion\Run"
set "app_name=DiscordRPCServer"

title Удаление Discord RPC
echo ========================================
echo  Полное удаление Discord RPC
echo ========================================

:: 1. Остановка процесса
taskkill /IM discord-rpc-server.exe /F >nul 2>&1
if %ERRORLEVEL%==0 (
    echo [?] Процесс discord-rpc-server.exe остановлен
) else (
    echo [i] Процесс не был запущен
)

:: 2. Удаление из автозапуска
reg delete "%startup_reg_key%" /v "%app_name%" /f >nul 2>&1
if %ERRORLEVEL%==0 (
    echo [?] Удалено из автозапуска
) else (
    echo [i] Запись в автозапуске не найдена
)

:: 3. Удаление регистрации протокола
reg delete "%protocol_reg_key%" /f >nul 2>&1
if %ERRORLEVEL%==0 (
    echo [?] Протокол rtc:// удален из реестра
) else (
    echo [i] Протокол не был зарегистрирован
)

:: 4. Удаление файлов
if exist "%vbs_launcher%" (
    del /F /Q "%vbs_launcher%" >nul && echo [?] VBS-скрипт удален
)

if exist "%exe_file%" (
    del /F /Q "%exe_file%" >nul && echo [?] EXE-файл удален
)

:: 5. Удаление папки (если пуста)
if exist "%appdata_dir%" (
    rmdir "%appdata_dir%" >nul 2>&1
    if %ERRORLEVEL%==0 (
        echo [?] Папка программы удалена
    ) else (
        echo [i] Папка не пуста (возможно, остались другие файлы)
    )
)

:: 6. Дополнительная проверка оставшихся процессов
tasklist | find "discord-rpc-server.exe" >nul
if %ERRORLEVEL%==0 (
    echo [!] Обнаружен запущенный процесс. Попробуйте перезагрузить ПК.
)

echo ========================================
echo  Удаление завершено!
echo ========================================
pause