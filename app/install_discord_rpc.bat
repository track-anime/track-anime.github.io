@echo off
chcp 1251 >nul
setlocal enabledelayedexpansion

:: ========================================
::  ��������� ����������
:: ========================================
set "COLOR_TITLE=0B"
set "COLOR_SUCCESS=0A"
set "COLOR_WARNING=0E"
set "COLOR_ERROR=0C"
set "COLOR_INFO=0F"
set "LINE========================================="

:: ========================================
::  ������������ ���������
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
::  �������������
:: ========================================
title Discord RPC :: ���������
cls
echo.
echo %LINE%
echo  D I S C O R D   R P C   � � � � � � � � �
echo %LINE%
echo.

:: ������� ���-����
if not exist "%appdata_dir%" mkdir "%appdata_dir%"
echo [%date% %time%] ������ ��������� >nul

:: ========================================
::  0. ���������� ������
:: ========================================
echo [0] ���������� ������...
echo [%date% %time%] ���������� ������ >>nul

:: ��������� �������� ����
curl -L -o "%source_file%" "%download_url%" --progress-bar
if exist "%source_file%" (
    call :log_success "���� discord-rpc-server.exe ������� ������"
) else (
    call :log_error "������ ���������� ����� discord-rpc-server.exe"
    exit /b 1
)

:: ��������� ���� ��������
curl -L -o "%uninstall_file%" "%uninstall_url%" --progress-bar
if exist "%uninstall_file%" (
    call :log_success "���� uninstall_discord_rpc.bat ������� ������"
) else (
    call :log_warning "�� ������� ������� ���� uninstall_discord_rpc.bat"
)

:: ========================================
::  1. ��������� ���������� ������
:: ========================================
echo [1] ��������� ���������� ������...
echo [%date% %time%] ��������� �������� >>nul
taskkill /IM discord-rpc-server.exe /F >nul 2>&1
if %ERRORLEVEL%==0 (
    call :log_success "������� ����������"
) else (
    call :log_info "������� �� ��� �������"
)

:: ========================================
::  2. ����������� ������
:: ========================================
echo [2] ��������� ������...
echo [%date% %time%] ����������� ������ >>nul

if not exist "%source_file%" (
    call :log_error "�������� ���� �� ������!"
    exit /b 1
)

copy "%source_file%" "%destination_file%" >nul
if exist "%destination_file%" (
    call :log_success "����� ������� �����������"
) else (
    call :log_error "������ ����������� ������"
    exit /b 1
)

:: ========================================
::  3. �������� ������� ��� �������� �������
:: ========================================
echo [3] ��������� �����������...
echo [%date% %time%] �������� VBS-������� >>nul

(
    echo Set WshShell = CreateObject("WScript.Shell"^)
    echo WshShell.Run chr(34^) ^& "%destination_file%" ^& chr(34^), 0
    echo Set WshShell = Nothing
) > "%vbs_launcher%"

if exist "%vbs_launcher%" (
    call :log_success "������ ������"
) else (
    call :log_error "������ �������� �������"
    exit /b 1
)

:: ========================================
::  4. ��������� �����������
:: ========================================
echo [4] ��������� �������...
echo [%date% %time%] �������������� ������� >>nul

reg add "%startup_reg_key%" /v "%app_name%" /t REG_SZ /d "wscript.exe //B \"%vbs_launcher%\"" /f >nul 2>&1
if %ERRORLEVEL%==0 (
    call :log_success "���������� ��������"
) else (
    call :log_warning "�� ������� �������� � ���������� (���������� ������ �� ��������������)"
)

:: ========================================
::  5. ����������� ���������
:: ========================================
echo [5] ����������� ��������� rtc://...
echo [%date% %time%] ����������� ��������� >>nul

reg add "%protocol_reg_key%" /v "" /t REG_SZ /d "URL:RTC Protocol" /f >nul 2>&1
reg add "%protocol_reg_key%" /v "URL Protocol" /t REG_SZ /d "" /f >nul 2>&1
reg add "%protocol_reg_key%\shell\open\command" /v "" /t REG_SZ /d "\"%destination_file%\" \"%%1\"" /f >nul 2>&1

if %ERRORLEVEL%==0 (
    call :log_success "�������� ���������������"
) else (
    call :log_warning "�� ������� ���������������� ��������"
)

:: ========================================
::  ���������� ���������
:: ========================================
echo [%date% %time%] ������ ��������� >>nul
start "" wscript.exe //B "%vbs_launcher%"

:: �������� ��������� ��������� ������
if exist "%source_file%" (
    del "%source_file%" >nul 2>&1
    call :log_info "��������� ���� discord-rpc-server.exe ������"
)

echo.
echo %LINE%
call :color_print " ��������� ��������� �������! " %COLOR_SUCCESS%
echo %LINE%
echo.
echo.
pause
exit /b 0

:: ========================================
::  ������� ����������
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