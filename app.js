const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs'); // fs modülünü dahil ettik

let mainWindow;
let ghostWindow;
let pythonProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    frame: false,
    icon: path.join(__dirname, 'Asset/app.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'JS/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false,
    }
  });

  mainWindow.loadFile('index.html');
  Menu.setApplicationMenu(null);

  mainWindow.on('closed', () => {
    if (ghostWindow) {
      ghostWindow.close();
    }
    if (pythonProcess) {
      pythonProcess.kill();
    }
    mainWindow = null;
  });

  mainWindow.setFullScreen(false);
  mainWindow.resizable = false;
}

function createGhostWindow() {
  ghostWindow = new BrowserWindow({
    width: 400,
    height: 700,
    frame: false,
      alwaysOnTop: true,  // Varsayılan olarak sabitlenmemiş
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false,
    }
  });

  ghostWindow.loadFile('ghostinfo.html');

  ipcMain.on('minimize-window', () => {
    mainWindow.minimize();
});

  ghostWindow.on('closed', () => {
    ghostWindow = null;
  });
}

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
    pythonProcess = spawn('python', [path.join(__dirname, 'Python/mental.py')]);

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

// IPC iletişimini dinleyin ve ghostWindow penceresini açın
ipcMain.handle('open-ghost-window', () => {
  if (!ghostWindow) {
    createGhostWindow();
  }
});
// Güncelleme işlemlerini başlatan IPC işleyicisi
ipcMain.handle('start-update', () => {
  return new Promise((resolve, reject) => {
    pythonProcess = spawn('python', [path.join(__dirname, 'Python/update_check.py')]);

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


 //Settings bölümü
 app.whenReady().then(() => {

  ipcMain.on('settings-update', (event, data) => {
      const filePath = path.join(__dirname, 'Data/save.json');

      // Dosya var mı kontrol et
      if (!fs.existsSync(filePath)) {
          console.error('Dosya bulunamadı:', filePath);
          // Dosya oluşturulabilir veya başka bir işlem yapılabilir
          fs.writeFileSync(filePath, JSON.stringify({}));
      }

      fs.readFile(filePath, (err, fileData) => {
          if (err) {
              console.error('Dosya okuma hatası:', err);
              return; 
          }

          let settings = {};
          try {
              settings = JSON.parse(fileData);
          } catch (parseError) {
              console.error('JSON ayrıştırma hatası:', parseError);
          }

          settings[data.key] = data.value;

          fs.writeFile(filePath, JSON.stringify(settings, null, 2), (err) => {
              if (err) {
                  console.error('Dosya kaydetme hatası:', err);
              }
          });
      });
  });
});