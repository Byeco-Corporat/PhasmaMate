async function checkForUpdate() {
    const statusSpan = document.getElementById('updateStatus');
    statusSpan.textContent = 'Checking for updates...';
    statusSpan.style.color = 'blue';

    try {
        const response = await fetch('/check-for-update');
        const result = await response.json();

        if (result.updateAvailable) {
            statusSpan.textContent = `New version available: ${result.latestVersion}`;
            statusSpan.style.color = 'orange';
            await startUpdate(result.assets);  // Güncelleme işlemini başlat
        } else {
            statusSpan.textContent = 'You are already using the latest version.';
            statusSpan.style.color = 'green';
        }
    } catch (error) {
        statusSpan.textContent = 'Error checking update';
        statusSpan.style.color = 'red';
        console.error('Update check failed:', error);
    }
}

async function startUpdate(assets) {
    const statusSpan = document.getElementById('updateStatus');
    statusSpan.textContent = 'Updating...';
    statusSpan.style.color = 'orange';

    try {
        for (let asset of assets) {
            const downloadResponse = await fetch(`/download?url=${encodeURIComponent(asset.downloadUrl)}`);
            if (!downloadResponse.ok) {
                throw new Error(`Failed to download ${asset.name}`);
            }

            statusSpan.textContent = `Extracting ${asset.name}...`;
            const extractResponse = await fetch(`/extract?file=${encodeURIComponent(asset.name)}`);
            if (!extractResponse.ok) {
                throw new Error(`Failed to extract ${asset.name}`);
            }
        }

        statusSpan.textContent = 'Update completed successfully.';
        statusSpan.style.color = 'green';
    } catch (error) {
        statusSpan.textContent = 'Update failed';
        statusSpan.style.color = 'red';
        console.error('Update failed:', error);
    }
}
