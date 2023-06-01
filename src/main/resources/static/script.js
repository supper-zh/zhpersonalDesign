// Add your custom JavaScript code here

// Example function to make an API request to retrieve ship data
function getShipData() {
    // Make an AJAX request or use fetch API to call the backend API endpoint
    // and retrieve ship data
    fetch('/api/ship/all')
        .then(response => response.json())
        .then(data => {
            // Process the ship data and update the DOM
            renderShipData(data);
        })
        .catch(error => {
            console.error('Error fetching ship data:', error);
        });
}

// Example function to render ship data on the page
function renderShipData(data) {
    const tableBody = document.getElementById('ship-data');

    // Clear existing table rows
    tableBody.innerHTML = '';

    // Iterate over the ship data and create table rows
    data.forEach(ship => {
        const row = document.createElement('tr');

        const idCell = document.createElement('td');
        idCell.textContent = ship.id;
        row.appendChild(idCell);

        const targetIdCell = document.createElement('td');
        targetIdCell.textContent = ship.targetId;
        row.appendChild(targetIdCell);

        // Add more cells for other ship properties as needed

        tableBody.appendChild(row);
    });
}

// Call the function to retrieve ship data when the page loads
window.addEventListener('load', getShipData);
