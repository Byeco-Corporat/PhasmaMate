function answerQuestion(questionId, answer) {
    // Simulate a backend call to fetch ghost info
    fetch(`/ghost-info.py?question=${questionId}&answer=${answer}`)
        .then(response => response.json())
        .then(data => updateGhosts(data))
        .catch(error => console.error('Error:', error));
}

function updateGhosts(data) {
    // Reset all ghosts to inactive
    const ghosts = document.querySelectorAll('.ghost-wrapper');
    ghosts.forEach(ghost => ghost.classList.add('inactive'));

    // Update ghosts based on data
    for (const [ghostId, isActive] of Object.entries(data)) {
        const ghostElement = document.getElementById(ghostId);
        if (ghostElement) {
            if (isActive) {
                ghostElement.classList.remove('inactive');
                ghostElement.classList.add('active');
            } else {
                ghostElement.classList.remove('active');
                ghostElement.classList.add('inactive');
            }
        }
    }
}