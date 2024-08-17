function updateGhostType() {
    const checkboxes = document.querySelectorAll('input[name="evidence"]:checked');
    const selectedValues = Array.from(checkboxes).map(cb => cb.value);

    if (selectedValues.length > 4) {
        alert("Maksimum 4 kanıt seçebilirsiniz.");
        
        // Tüm seçili checkboksları kaldır
        checkboxes.forEach(cb => cb.checked = false);

        return;
    }

    fetch('/determine-ghost', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ evidences: selectedValues }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Error:', data.error);
            alert(data.error);
            
            // Hata durumunda tüm seçili checkboksları kaldır
            checkboxes.forEach(cb => cb.checked = false);
        } else {
            document.getElementById('ghost-result').innerText = data.ghosts;
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
