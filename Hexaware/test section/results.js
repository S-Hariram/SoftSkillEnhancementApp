let resultDb;

// Open the resultDB
const request = indexedDB.open("resultDB", 2);
request.onupgradeneeded = function(event) {
    const db = event.target.result;
    if (!db.objectStoreNames.contains("results")) {
        db.createObjectStore("results", { keyPath: ["section", "topic"] });
    }
};

request.onsuccess = function(event) {
    resultDb = event.target.result;
    fetchAndDisplayResults();
};

// Fetch and display results from the resultDB
function fetchAndDisplayResults() {
    const transaction = resultDb.transaction("results", "readonly");
    const objectStore = transaction.objectStore("results");
    const resultsContainer = document.getElementById('resultsContainer');

    resultsContainer.innerHTML = ''; // Clear previous results

    objectStore.openCursor().onsuccess = function(event) {
        const cursor = event.target.result;
        if (cursor) {
            // Create a result card for each result
            const resultCard = document.createElement('div');
            resultCard.className = 'result-card';
            resultCard.innerHTML = `
                <h3>${cursor.value.topic}</h3>
                <p><strong>Section:</strong> ${cursor.value.section}</p>
                <p><strong>Score:</strong> ${cursor.value.score} out of ${cursor.value.totalQuestions}</p>
                <p><strong>Details:</strong> ${cursor.value.details || 'No additional details available.'}</p>
            `;
            resultsContainer.appendChild(resultCard);
            cursor.continue(); // Continue to the next item
        } else {
            // Handle case where no results are found
            if (resultsContainer.innerHTML === '') {
                resultsContainer.innerHTML = '<p>No results found.</p>';
            }
        }
    };

    transaction.onerror = function(event) {
        console.error("Error fetching results: ", event.target.error);
        resultsContainer.innerHTML = '<p>Error fetching results. Please try again later.</p>';
    };
}

// Back to main page
document.getElementById('backButton').onclick = function() {
    // Redirect to the main page
    window.location.href = './test section/intial-page-user.html'; // Ensure you have an index.html to redirect to
};
