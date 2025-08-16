@echo off
chcp 1251 >nul
set "appdata_dir=%APPDATA%\DiscordRPC"
set "exe_file=%appdata_dir%\discord-rpc-server.exe"
set "vbs_launcher=%appdata_dir%\start_hidden.vbs"
set "protocol_name=rtc"
set "protocol_reg_key=HKCR\%protocol_name%"
set "startup_reg_key=HKCU\Software\Microsoft\Windows\CurrentVersion\Run"
set "app_name=DiscordRPCServer"

title �������� Discord RPC
echo ========================================
echo  ������ �������� Discord RPC
echo ========================================

:: 1. ��������� ��������
taskkill /IM discord-rpc-server.exe /F >nul 2>&1
if %ERRORLEVEL%==0 (
    echo [?] ������� discord-rpc-server.exe ����������
) else (
    echo [i] ������� �� ��� �������
)

:: 2. �������� �� �����������
reg delete "%startup_reg_key%" /v "%app_name%" /f >nul 2>&1
if %ERRORLEVEL%==0 (
    echo [?] ������� �� �����������
) else (
    echo [i] ������ � ����������� �� �������
)

:: 3. �������� ����������� ���������
reg delete "%protocol_reg_key%" /f >nul 2>&1
if %ERRORLEVEL%==0 (
    echo [?] �������� rtc:// ������ �� �������
) else (
    echo [i] �������� �� ��� ���������������
)

:: 4. �������� ������
if exist "%vbs_launcher%" (
    del /F /Q "%vbs_launcher%" >nul && echo [?] VBS-������ ������
)

if exist "%exe_file%" (
    del /F /Q "%exe_file%" >nul && echo [?] EXE-���� ������
)

:: 5. �������� ����� (���� �����)
if exist "%appdata_dir%" (
    rmdir "%appdata_dir%" >nul 2>&1
    if %ERRORLEVEL%==0 (
        echo [?] ����� ��������� �������
    ) else (
        echo [i] ����� �� ����� (��������, �������� ������ �����)
    )
)

:: 6. �������������� �������� ���������� ���������
tasklist | find "discord-rpc-server.exe" >nul
if %ERRORLEVEL%==0 (
    echo [!] ��������� ���������� �������. ���������� ������������� ��.
)

echo ========================================
echo  �������� ���������!
echo ========================================
pause