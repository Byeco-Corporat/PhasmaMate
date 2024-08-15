const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'JS/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false, // Bu ayarı kaldırdım, contextIsolation kullanıyoruz
    }
  });

  mainWindow.loadFile('index.html');
  Menu.setApplicationMenu(null);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.maximize();
}

// Electron uygulamasını başlat
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC iletişimini dinleyin ve Python scriptini başlatın
ipcMain.handle('start-python-overlay', () => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', [path.join(__dirname, 'Python/info.py')]);

    pythonProcess.stdout.on('data', (data) => {
      console.log(`Python stdout: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      console.log(`Python script exited with code ${code}`);
      resolve(code);
    });

    pythonProcess.on('error', (err) => {
      console.error(`Error: ${err}`);
      reject(err);
    });
  });
});
