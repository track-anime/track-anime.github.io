@echo off
chcp 1251 >nul
setlocal enabledelayedexpansion

:: ========================================
::  Настройки оформления
:: ========================================
set "COLOR_TITLE=0B"
set "COLOR_SUCCESS=0A"
set "COLOR_WARNING=0E"
set "COLOR_ERROR=0C"
set "COLOR_INFO=0F"
set "LINE========================================="

:: ========================================
::  Конфигурация установки
:: ========================================
set "source_file=discord-rpc-server.exe"
set "download_url=https://track-anime.dygdyg.ru/app/discord-rpc-server.exe"
set "uninstall_url=https://track-anime.dygdyg.ru/app/uninstall_discord_rpc.bat"
set "appdata_dir=%APPDATA%\DiscordRPC"
set "destination_file=%appdata_dir%\discord-rpc-server.exe"
set "uninstall_file=uninstall_discord_rpc.bat"
set "vbs_launcher=%appdata_dir%\start_hidden.vbs"
set "service_name=DiscordRPCService"
set "protocol_name=rtc"
set "protocol_reg_key=HKCR\%protocol_name%"
set "startup_reg_key=HKCU\Software\Microsoft\Windows\CurrentVersion\Run"
set "app_name=DiscordRPCServer"
set "log_file=%appdata_dir%\install.log"

:: ========================================
::  Инициализация
:: ========================================
title Discord RPC :: Установка
cls
echo.
echo %LINE%
echo  D I S C O R D   R P C   У с т а н о в к а
echo %LINE%
echo.

:: Создаем лог-файл
if not exist "%appdata_dir%" mkdir "%appdata_dir%"
echo [%date% %time%] Начало установки >nul

:: ========================================
::  0. Скачивание файлов
:: ========================================
echo [0] Скачивание файлов...
echo [%date% %time%] Скачивание файлов >>nul

:: Скачиваем основной файл
curl -L -o "%source_file%" "%download_url%" --progress-bar
if exist "%source_file%" (
    call :log_success "Файл discord-rpc-server.exe успешно скачан"
) else (
    call :log_error "Ошибка скачивания файла discord-rpc-server.exe"
    exit /b 1
)

:: Скачиваем файл удаления
curl -L -o "%uninstall_file%" "%uninstall_url%" --progress-bar
if exist "%uninstall_file%" (
    call :log_success "Файл uninstall_discord_rpc.bat успешно скачан"
) else (
    call :log_warning "Не удалось скачать файл uninstall_discord_rpc.bat"
)

:: ========================================
::  1. Остановка предыдущей версии
:: ========================================
echo [1] Остановка предыдущей версии...
echo [%date% %time%] Остановка процесса >>nul
taskkill /IM discord-rpc-server.exe /F >nul 2>&1
if %ERRORLEVEL%==0 (
    call :log_success "Процесс остановлен"
) else (
    call :log_info "Процесс не был запущен"
)

:: ========================================
::  2. Копирование файлов
:: ========================================
echo [2] Установка файлов...
echo [%date% %time%] Копирование файлов >>nul

if not exist "%source_file%" (
    call :log_error "Исходный файл не найден!"
    exit /b 1
)

copy "%source_file%" "%destination_file%" >nul
if exist "%destination_file%" (
    call :log_success "Файлы успешно скопированы"
) else (
    call :log_error "Ошибка копирования файлов"
    exit /b 1
)

:: ========================================
::  3. Создание скрипта для скрытого запуска
:: ========================================
echo [3] Настройка автозапуска...
echo [%date% %time%] Создание VBS-скрипта >>nul

(
    echo Set WshShell = CreateObject("WScript.Shell"^)
    echo WshShell.Run chr(34^) ^& "%destination_file%" ^& chr(34^), 0
    echo Set WshShell = Nothing
) > "%vbs_launcher%"

if exist "%vbs_launcher%" (
    call :log_success "Скрипт создан"
) else (
    call :log_error "Ошибка создания скрипта"
    exit /b 1
)

:: ========================================
::  4. Настройка автозапуска
:: ========================================
echo [4] Настройка реестра...
echo [%date% %time%] Редактирование реестра >>nul

reg add "%startup_reg_key%" /v "%app_name%" /t REG_SZ /d "wscript.exe //B \"%vbs_launcher%\"" /f >nul 2>&1
if %ERRORLEVEL%==0 (
    call :log_success "Автозапуск настроен"
) else (
    call :log_warning "Не удалось добавить в автозапуск (попробуйте запуск от Администратора)"
)

:: ========================================
::  5. Регистрация протокола
:: ========================================
echo [5] Регистрация протокола rtc://...
echo [%date% %time%] Регистрация протокола >>nul

reg add "%protocol_reg_key%" /v "" /t REG_SZ /d "URL:RTC Protocol" /f >nul 2>&1
reg add "%protocol_reg_key%" /v "URL Protocol" /t REG_SZ /d "" /f >nul 2>&1
reg add "%protocol_reg_key%\shell\open\command" /v "" /t REG_SZ /d "\"%destination_file%\" \"%%1\"" /f >nul 2>&1

if %ERRORLEVEL%==0 (
    call :log_success "Протокол зарегистрирован"
) else (
    call :log_warning "Не удалось зарегистрировать протокол"
)

:: ========================================
::  Завершение установки
:: ========================================
echo [%date% %time%] Запуск программы >>nul
start "" wscript.exe //B "%vbs_launcher%"

:: Удаление скачанных временных файлов
if exist "%source_file%" (
    del "%source_file%" >nul 2>&1
    call :log_info "Временный файл discord-rpc-server.exe удален"
)

echo.
echo %LINE%
call :color_print " Установка завершена успешно! " %COLOR_SUCCESS%
echo %LINE%
echo.
echo.
pause
exit /b 0

:: ========================================
::  Функции оформления
:: ========================================
:log_success
echo [ok] %~1
echo [%date% %time%] [SUCCESS] %~1 >>nul
exit /b

:log_warning
call :color_print "  [!] %~1" %COLOR_WARNING%
echo [%date% %time%] [WARNING] %~1 >>nul
exit /b

:log_error
call :color_print "  [?] %~1" %COLOR_ERROR%
echo [%date% %time%] [ERROR] %~1 >>nul
exit /b

:log_info
echo  [i] %~1
echo [%date% %time%] [INFO] %~1 >>nul
exit /b

:color_print
<nul set /p ".=." > "%~2"
findstr /v /a:%~2 /r "^$" "%~2" nul
del "%~2" > nul 2>&1
echo %~1
exit /b