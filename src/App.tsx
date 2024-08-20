import React, { useState, useRef, useEffect } from 'react';
import './styles.css';
import Toast from './components/Toast'; // Import the Toast component
import NotificationContainer, { useNotification } from './components/NotificationContainer';

const App: React.FC = () => {
    const { showNotification } = useNotification();

    const [updateStatus, setUpdateStatus] = useState<string>('Güncelle');
    const [progress, setProgress] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isWindowOpen, setIsWindowOpen] = useState<boolean>(false);
    const [isRichPresenceEnabled, setIsRichPresenceEnabled] = useState<boolean>(false); // State for Discord Rich Presence
    const newWindowRef = useRef<Window | null>(null);
    const [showToast, setShowToast] = useState<boolean>(true); // State for toast visibility

    useEffect(() => {
        // Automatically hide the toast after 3 seconds
        const timer = setTimeout(() => {
            setShowToast(false);
        }, 3000);

        return () => clearTimeout(timer); // Cleanup timer on component unmount
    }, []);

    const checkForUpdate = async () => {
        setError(null);
        setUpdateStatus('Güncellemeler kontrol ediliyor...');
        setProgress(null);

        try {
            const response = await fetch('https://api.github.com/repos/{owner}/{repo}/releases/latest');
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

    const toggleRichPresence = () => {
        const newRichPresenceState = !isRichPresenceEnabled;
        setIsRichPresenceEnabled(newRichPresenceState);
    
        if (newRichPresenceState) {
            // Send a request to the backend to run the Python script
            fetch('./components/custom-presence.py', { method: 'POST' })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to run Discord Rich Presence script.');
                    }
                    showNotification('Discord Rich Presence activated!', 'success');
                })
                .catch(error => {
                    console.error('Error running custom-presence.py:', error);
                    showNotification('Failed to start Discord Rich Presence.', 'error');
                });
        } else {
            showNotification('Discord Rich Presence deactivated.', 'info');
        }
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

            {/* Centered Switch Container */}
            <div className="centered-switch-container">
                <div className="switch-container">
                    <span className="switch-label">Hayalet İpuçları</span>
                    <label className="switch">
                        <input type="checkbox" checked={isWindowOpen} onChange={toggleWindow} />
                        <span className="slider round"></span>
                    </label>
                </div>
                <div className="switch-container">
    <span className="switch-label">Discord Rich Presence</span>
    <label className="switch">
        <input type="checkbox" checked={isRichPresenceEnabled} onChange={toggleRichPresence} />
        <span className="slider round"></span>
    </label>
</div>

            </div>

            {/* Toast Notification */}
            {showToast && (
                <Toast message="PhasmaMate başarılı şekilde açıldı." />
            )}

            <NotificationContainer />
        </div>
    );
}

export default App;

