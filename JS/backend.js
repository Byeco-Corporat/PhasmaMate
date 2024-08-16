window.onload = function() {
    showToast();
};

const toggleSwitch = document.getElementById('overlay-toggle2');
            
toggleSwitch.addEventListener('change', () => {
    if (toggleSwitch.checked) {
        window.electronAPI.openGhostWindow();
    }
});



function showToast() {
    const toast = document.getElementById("toast");
    toast.className = "show";
    setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 5000);
}

document.querySelectorAll('.toggle-switch input').forEach(input => {
    input.addEventListener('change', (event) => {
        if (event.target.checked) {
            window.api.startPythonOverlay().then(() => {
                console.log('Python script successfully executed.');
            }).catch((err) => {
                console.error('Failed to execute Python script:', err);
            });
        } else {
            window.api.stopPythonOverlay().then(() => {
                console.log('Python script successfully stopped.');
            }).catch((err) => {
                console.error('Failed to stop Python script:', err);
            });
        }
    });
});

function minimizeWindow() {
    console.log('Minimize button clicked');
}

function maximizeWindow() {
    console.log('Maximize button clicked');
}

function closeWindow() {
    window.close();
}

