@echo off

REM Localhost sunucusunu başlatma
echo Starting Localhost server...
start cmd /k "cd /d %~dp0Server && node server.js"
start cmd /k "cd /d %~dp0App && npm install && npm start"
start cmd /k "cd /d %~dp0Backend && python app.py"

REM Bütün işlemleri başlatıldıktan sonra komutu bekleme
pause
