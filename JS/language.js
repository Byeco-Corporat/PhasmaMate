// JS/language.js

// Fonksiyon: Dil bilgisini ve metinleri yükle
async function loadLanguage() {
    try {
        // 1. Dil bilgisini oku
        const response = await fetch('./Data/save.json');
        const data = await response.json();
        const language = data.language;

        // 2. Dil dosyasını yükle
        const langResponse = await fetch(`./Data/language/${language}.json`);
        const langData = await langResponse.json();

        // 3. Metinleri güncelle
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (langData[key]) {
                element.textContent = langData[key];
            }
        });
    } catch (error) {
        console.error('Dil yükleme hatası:', error);
    }
}

// Sayfa yüklendiğinde dil bilgisini yükle
document.addEventListener('DOMContentLoaded', loadLanguage);
