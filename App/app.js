const { app, BrowserWindow, nativeImage, Menu, ipcMain } = require('electron');
const path = require('path');
const { execFile } = require('child_process');

let customWindow;

function createCustomWindow() {
  customWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  customWindow.maximize();

  const iconPath = path.join(__dirname, 'Asset/app.ico');
  const icon = nativeImage.createFromPath(iconPath);
  customWindow.setIcon(icon);

  // Localhost üzerinden frontend'i yükle
  customWindow.loadURL('http://localhost:3000');

  const menu = Menu.buildFromTemplate([]);
  Menu.setApplicationMenu(menu);

  customWindow.on('closed', () => {
    customWindow = null;
  });
}

app.whenReady().then(() => {
  createCustomWindow();
  customWindow.show();

  app.on('activate', () => {
    if (!customWindow) {
      createCustomWindow();
      customWindow.show();
    }
  });

  // Python scriptini başlatma
  const pythonProcess = execFile('python', [path.join(__dirname, '../Backend/app.py')], (error, stdout, stderr) => {
    if (error) {
      console.error(`execFile error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });

  // Python scriptini uygulama kapandığında durdurma
  app.on('before-quit', () => {
    pythonProcess.kill();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC mesajlarını dinleme (Örneğin: pencereyi kapatma işlemi)
ipcMain.on('close-window', () => {
  if (customWindow) {
    customWindow.close();
  }
});
