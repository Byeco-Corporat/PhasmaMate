const { contextBridge, ipcRenderer } = require('electron');

// Python Overlay'i başlatma işlevi
contextBridge.exposeInMainWorld('api', {
  startPythonOverlay: () => ipcRenderer.invoke('start-python-overlay')
});

// Ghost Window açma işlevi
contextBridge.exposeInMainWorld('electronAPI', {
  openGhostWindow: () => ipcRenderer.invoke('open-ghost-window')
});

// Güncelleme işlemleri
contextBridge.exposeInMainWorld('updateAPI', {
  startUpdate: () => ipcRenderer.invoke('start-update')
});

ipcRenderer.on('update-available', () => {
  const updateButton = document.getElementById('updateButton');
  if (updateButton) {
    updateButton.style.display = 'block';
  }
});
