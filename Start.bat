@echo off

REM Localhost sunucusunu arka planda çalıştırma
cd /d "%~dp0Server"
start "" /min cmd /c "node app.js > server_output.log 2>&1"

REM App'i arka planda çalıştırma
cd /d "%~dp0App"
npm install
start "" /min cmd /c "npm start > app_output.log 2>&1"

REM Backend'i arka planda çalıştırma
cd /d "%~dp0Backend"
start "" /min cmd /c "python app.py > backend_output.log 2>&1"

REM İşlemlerin başlatıldığını bildirme ve komut dosyasını bitirme
echo All processes started. Logs are being saved to log files.
pause
