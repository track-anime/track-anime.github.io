@echo off
echo %~dp0
cd /D %~dp0


scan.exe
for /f "tokens=1-4 delims=. " %%a in ('echo %date%') do set dt=%%a-%%b-%%c
for /f "tokens=1-4 delims=:., " %%a in ('echo %time%') do set tm=%%a-%%b-%%c-%%d
set datetime=%dt%_%tm%
echo %datetime% >vers.info
git add .
git commit -m "%datetime%"
git push origin main
timeout 5
rem pause