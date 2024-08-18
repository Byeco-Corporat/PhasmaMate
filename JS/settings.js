// Modal açma/kapatma işlemleri
document.getElementById('settings-button').addEventListener('click', function() {
    document.getElementById('panel').classList.remove('hidden');
});

document.querySelector('.close-button').addEventListener('click', function() {
    document.getElementById('panel').classList.add('hidden');
});

window.addEventListener('click', function(event) {
    if (event.target === document.getElementById('panel')) {
        document.getElementById('panel').classList.add('hidden');
    }
});

// Ayarları kaydetme ve geri yükleme fonksiyonları
function saveLanguageSetting(language) {
    localStorage.setItem('language', language);
}

function loadLanguageSetting() {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        document.getElementById('language-select').value = savedLanguage;
    }
}

function saveThemeSetting(isDarkMode) {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

function loadThemeSetting() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.getElementById('theme-toggle').checked = true;
        document.body.classList.add('dark-mode');
    } else {
        document.getElementById('theme-toggle').checked = false;
        document.body.classList.remove('dark-mode');
    }
}

function loadSettings() {
    loadLanguageSetting();
    loadThemeSetting();
}

document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
});

document.getElementById('language-select').addEventListener('change', function() {
    saveLanguageSetting(this.value);
});

document.getElementById('theme-toggle').addEventListener('change', function() {
    saveThemeSetting(this.checked);
});

document.getElementById('reset-settings').addEventListener('click', function() {
    const defaultLanguage = 'tr';
    const defaultTheme = 'light';

    document.getElementById('language-select').value = defaultLanguage;
    document.getElementById('theme-toggle').checked = false;
    document.body.classList.remove('dark-mode');

    saveLanguageSetting(defaultLanguage);
    saveThemeSetting(false);

    alert('Ayarlar varsayılan değerlere döndürüldü!');
});


