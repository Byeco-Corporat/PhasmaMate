import React, { useState, useRef, useEffect } from 'react';
import './styles.css';
import Tooltip from './components/Tooltip';
import Toast from './components/Toast';
import NotificationContainer, { useNotification } from './components/NotificationContainer';
import CustomTitleBar from './components/CustomTitleBar'; // Import the custom title bar

const App: React.FC = () => {
    const { showNotification } = useNotification();

    const [updateStatus, setUpdateStatus] = useState<string>('Güncelle');
    const [progress, setProgress] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isWindowOpen, setIsWindowOpen] = useState<boolean>(false);
    const [isRichPresenceEnabled, setIsRichPresenceEnabled] = useState<boolean>(false);
    const newWindowRef = useRef<Window | null>(null);
    const [showToast, setShowToast] = useState<boolean>(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowToast(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const checkForUpdate = async () => {
        setError(null);
        setUpdateStatus('Güncellemeler kontrol ediliyor...');
        setProgress(null);

        try {
            const response = await fetch('https://api.github.com/repos/byeco/PhasmaMate/releases/latest');
            if (!response.ok) {
                throw new Error('GitHub API hatası');
            }

            const data = await response.json();

            if (!data || !data.assets || data.assets.length === 0) {
                setUpdateStatus('Güncelleme mevcut değil');
                showNotification('Güncelleme mevcut değil.', 'info');
                return;
            }

            const downloadUrl = data.assets[0].browser_download_url;

            const downloadResponse = await fetch(downloadUrl);
            if (!downloadResponse.ok) {
                throw new Error('İndirme başarısız oldu');
            }

            const contentLength = downloadResponse.headers.get('Content-Length');
            if (!contentLength) {
                throw new Error('İndirme boyutu alınamadı');
            }

            const total = parseInt(contentLength, 10);
            let loaded = 0;

            const reader = downloadResponse.body?.getReader();
            const stream = new ReadableStream({
                start(controller) {
                    function push() {
                        reader?.read().then(({ done, value }) => {
                            if (done) {
                                controller.close();
                                setUpdateStatus('Güncelleme tamamlandı');
                                setProgress(100);
                                showNotification('Güncelleme başarıyla tamamlandı!', 'success');
                                return;
                            }
                            loaded += value?.length ?? 0;
                            setProgress(Math.round((loaded / total) * 100));
                            controller.enqueue(value);
                            push();
                        }).catch(error => {
                            console.error('Hata:', error);
                            setError('Güncelleme sırasında bir hata oluştu. Lütfen tekrar deneyin.');
                            setUpdateStatus('Güncelleme başarısız oldu');
                            showNotification('Güncelleme başarısız oldu.', 'error');
                            controller.error(error);
                        });
                    }
                    push();
                }
            });

            new Response(stream).blob().then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'latest-release.zip';
                a.click();
                window.URL.revokeObjectURL(url);
            });

        } catch (error) {
            console.error('Güncellemeler kontrol edilemedi:', error);
            setError('Güncelleme başarısız oldu. Lütfen tekrar deneyin.');
            setUpdateStatus('Güncelle');
            showNotification('Güncelleme başarısız oldu.', 'error');
        }
    };

    const toggleWindow = () => {
        if (isWindowOpen) {
            newWindowRef.current?.close();
            setIsWindowOpen(false);
        } else {
            newWindowRef.current = window.open(
                'https://www.example.com',
                '_blank',
                'width=600,height=400'
            );
            setIsWindowOpen(true);
        }
    };

    const toggleRichPresence = async () => {
        const newRichPresenceState = !isRichPresenceEnabled;
        setIsRichPresenceEnabled(newRichPresenceState);

        try {
            if (newRichPresenceState) {
                const response = await fetch('./components/adim.py', { method: 'POST' });
                if (!response.ok) {
                    throw new Error('Failed to run Adım Algılayıcı script.');
                }
                showNotification('Adım Algılayıcı activated!', 'success');
            } else {
                showNotification('Adım Algılayıcı deactivated.', 'info');
            }
        } catch (error) {
            console.error('Error running adim.py:', error);
            showNotification('Failed to start Adım Algılayıcı.', 'error');
        }
    };

    return (
        <div className="app-container">
            <CustomTitleBar
                title="PhasmaMate"
                onClose={() => window.close()} // Custom close action
            />

            <div className="navbar">
                <button className="navbar-update-button" id="updateButton" onClick={checkForUpdate}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="#000000">
                        <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h200v80H160v480h640v-480H600v-80h200q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-184L280-544l56-56 104 104v-304h80v304l104-104 56 56-200 200Z"/>
                    </svg>
                    &nbsp; <span id="updateStatus">{progress !== null ? `İndiriliyor... ${progress}%` : updateStatus}</span>
                </button>

                {progress !== null && (
                    <div id="progress-bar-container">
                        <div id="progress-bar">
                            <div id="progress" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                )}

                {error && (
                    <div id="error-container">
                        <div id="error-message">
                            <p>{error}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="container">
                {/* Sol taraftaki Sidenav */}
                <div className="sidenav-left">
                    <h2 className="header">Menü</h2>
                    <div className="switch-card">
                        <div className="card-header">
                            <span>Hayalet İpuçları</span>
                            <button className="toggle-button" onClick={toggleWindow}>
                                {isWindowOpen ? "Disable" : "Enable"}
                            </button>
                        </div>
                        <div className="card-content">
                            <p>Status: {isWindowOpen ? "ON" : "OFF"}</p>
                            <p>Click to toggle the Hayalet İpuçları window.</p>
                        </div>
                    </div>

                    <div className="switch-card">
                        <div className="card-header">
                            <span>Adım Algılayıcı</span>
                            <button className="toggle-button" onClick={toggleRichPresence}>
                                {isRichPresenceEnabled ? "Disable" : "Enable"}
                            </button>
                        </div>
                        <div className="card-content">
                            <p>Status: {isRichPresenceEnabled ? "ON" : "OFF"}</p>
                            <p>Click to toggle the Adım Algılayıcı.</p>
                        </div>
                    </div>
                </div>

                {/* Sağ taraftaki Sidenav */}
                <div className="sidenav-right">
                    <h2 className="header">Güncellemeler</h2>
                    <div className="update-card">
                        <p>Son güncelleme: 21 Ağustos 2024</p>
                        <p>Bu uygulama, en yeni özellikler ve hata düzeltmeleri ile güncellendi.</p>
                    </div>
                    <button className="buttonPrimary">Güncelleme Kontrolü</button>
                </div>

                {/* Ana içerik */}
                <div className="content">
                    <h2 className="header">Ana İçerik</h2>
                    {/* Diğer içerik buraya gelecek */}
                </div>
            </div>

            {showToast && (
                <Toast message="PhasmaMate başarılı şekilde açıldı." />
            )}

            <NotificationContainer />
        </div>
    );
}

export default App;
