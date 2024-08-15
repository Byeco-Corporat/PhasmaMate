const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  startPythonOverlay: () => ipcRenderer.invoke('start-python-overlay')
});
