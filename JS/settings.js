// renderer.js
document.addEventListener("DOMContentLoaded", () => {
    const themeSelect = document.getElementById('them-select');
    const languageSelect = document.getElementById('language-select');
    const notificationsToggle = document.getElementById('notifications-toggle');
    const autoUpdateToggle = document.getElementById('auto-update-toggle');

    // Tema değişimi
    themeSelect.addEventListener('change', () => {
        ipcRenderer.send('settings-update', {
            key: 'theme',
            value: themeSelect.value
        });
    });

    // Dil değişimi
    languageSelect.addEventListener('change', () => {
        ipcRenderer.send('settings-update', {
            key: 'language',
            value: languageSelect.value
        });
    });

    // Bildirimler
    notificationsToggle.addEventListener('change', () => {
        ipcRenderer.send('settings-update', {
            key: 'notifications',
            value: notificationsToggle.checked
        });
    });

    // Otomatik güncellemeler
    autoUpdateToggle.addEventListener('change', () => {
        ipcRenderer.send('settings-update', {
            key: 'autoUpdate',
            value: autoUpdateToggle.checked
        });
    });
});
