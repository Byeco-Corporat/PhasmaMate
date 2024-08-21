import React, { useState, useRef, useEffect } from 'react';
import './styles.css';
import Tooltip from './components/Tooltip';
import Toast from './components/Toast';
import NotificationContainer, { useNotification } from './components/NotificationContainer';

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
                const response = await fetch('./components/custom-presence.py', { method: 'POST' });
                if (!response.ok) {
                    throw new Error('Failed to run Adım Algılayıcı script.');
                }
                showNotification('Adım Algılayıcı activated!', 'success');
            } else {
                showNotification('Adım Algılayıcı deactivated.', 'info');
            }
        } catch (error) {
            console.error('Error running custom-presence.py:', error);
            showNotification('Failed to start Adım Algılayıcı.', 'error');
        }
    };

    const handleToggleWindow = () => {
        toggleWindow();
        showNotification(`Hayalet İpuçları ${isWindowOpen ? "disabled" : "enabled"}.`, 'info');
    };

    const handleToggleRichPresence = () => {
        toggleRichPresence();
        showNotification(`Adım Algılayıcı ${isRichPresenceEnabled ? "disabled" : "enabled"}.`, 'info');
    };

    return (
        <div>
            <div id="navbar">
                <div id="navbar-title">PhasmaMate</div>
                <div id="navbar-buttons">
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
            </div>

            <div className="centered-switch-container">
                <Tooltip
                    content={
                        <div>
                            <p>Status: {isWindowOpen ? "ON" : "OFF"}</p>
                            <p>Click to toggle the Hayalet İpuçları window.</p>
                            <button className="tooltip-button" onClick={handleToggleWindow}>
                                {isWindowOpen ? "Disable" : "Enable"} Hayalet İpuçları
                            </button>
                        </div>
                    }
                    icon={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2a10 10 0 00-10 10c0 3.67 2.02 6.85 5 8.45V22h10v-1.55c2.98-1.6 5-4.78 5-8.45A10 10 0 0012 2zm0 18c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z"/><path d="M11 14h2v2h-2zM11 7h2v5h-2z"/></svg>}
                    backgroundColor={isWindowOpen ? "green" : "red"}
                >
                    <div className="switch-box">
                        <span className="switch-label">Hayalet İpuçları</span>
                        <label className="switch">
                            <input type="checkbox" checked={isWindowOpen} onChange={toggleWindow} />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </Tooltip>

                <Tooltip
                    content={
                        <div>
                            <p>Status: {isRichPresenceEnabled ? "ON" : "OFF"}</p>
                            <p>Click to toggle the Adım Algılayıcı.</p>
                            <button className="tooltip-button" onClick={handleToggleRichPresence}>
                                {isRichPresenceEnabled ? "Disable" : "Enable"} Adım Algılayıcı
                            </button>
                        </div>
                    }
                    icon={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M9 5.5c0-.83-.67-1.5-1.5-1.5S6 4.67 6 5.5 6.67 7 7.5 7 9 6.33 9 5.5zM15 6c-.83 0-1.5.67-1.5 1.5S14.17 9 15 9s1.5-.67 1.5-1.5S15.83 6 15 6zM9 11c-.83 0-1.5.67-1.5 1.5S8.17 14 9 14s1.5-.67 1.5-1.5S9.83 11 9 11zm6 1.5c0-.83-.67-1.5-1.5-1.5S12 11.67 12 12.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5zM11 18c-.83 0-1.5.67-1.5 1.5S10.17 21 11 21s1.5-.67 1.5-1.5S11.83 18 11 18zm6-1c-.83 0-1.5.67-1.5 1.5S16.17 20 17 20s1.5-.67 1.5-1.5S17.83 17 17 17zM12 12c-.83 0-1.5.67-1.5 1.5S11.17 15 12 15s1.5-.67 1.5-1.5S12.83 12 12 12z"/></svg>}
                    backgroundColor={isRichPresenceEnabled ? "green" : "red"}
                >
                    <div className="switch-box">
                        <span className="switch-label">Adım Algılayıcı</span>
                        <label className="switch">
                            <input type="checkbox" checked={isRichPresenceEnabled} onChange={toggleRichPresence} />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </Tooltip>
            </div>

            {showToast && (
                <Toast message="PhasmaMate başarılı şekilde açıldı." />
            )}

            <NotificationContainer />
        </div>
    );
}

export default App;
