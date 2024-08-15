@echo off

REM Localhost sunucusunu başlatma
echo Starting Localhost server...
start cmd /k "cd /d %~dp0Server && node server.js"

REM Electron uygulamasını başlatma
echo Starting Electron app...
start cmd /k "cd /d %~dp0App && npm install && npm start"

REM Python scriptini başlatma
echo Starting Python script...
start cmd /k "cd /d %~dp0Backend && python app.py"

REM Bütün işlemleri başlatıldıktan sonra komutu bekleme
pause
