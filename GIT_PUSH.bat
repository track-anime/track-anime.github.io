@echo off
echo %~dp0
cd /D %~dp0


scan.exe
@REM for /f "tokens=1-4 delims=. " %%a in ('echo %date%') do set dt=%%a-%%b-%%c
@REM for /f "tokens=1-4 delims=:., " %%a in ('echo %time%') do set tm=%%a-%%b-%%c
@REM set datetime=%dt%_%tm%
for /f "delims=" %%a in ('powershell -Command "(Get-Date).ToUniversalTime().ToString('yyyy-MM-dd HH:mm:ss')"') do set datetime=%%a

echo %datetime%
echo %datetime% >vers.info
git add .
git commit -m "%datetime%"
git push origin main
timeout 5
rem pause