const productData = {
    "Village A": [
        { name: "Sugar", price: 40, shop: "Kirana Mart A", lastUpdated: "2025-02-10" },
        { name: "Rice", price: 50, shop: "Fresh Grocery A", lastUpdated: "2025-02-09" }
    ],
    "Village B": [
        { name: "Sugar", price: 42, shop: "Daily Needs B", lastUpdated: "2025-02-11" },
        { name: "Wheat", price: 30, shop: "SuperMart B", lastUpdated: "2025-02-08" }
    ],
    "City X": [
        { name: "Sugar", price: 39, shop: "Mega Store X", lastUpdated: "2025-02-07" },
        { name: "Salt", price: 10, shop: "Quick Buy X", lastUpdated: "2025-02-06" }
    ]
};

document.getElementById("search").addEventListener("input", updateResults);
document.getElementById("location").addEventListener("change", updateResults);

function updateResults() {
    const location = document.getElementById("location").value;
    const searchQuery = document.getElementById("search").value.toLowerCase();
    const resultsTable = document.getElementById("results").getElementsByTagName("tbody")[0];

    resultsTable.innerHTML = "";

    if (!location) {
        document.body.style.backgroundColor = "#ADD8E6"; // Default blue
        return;
    }

    let filteredData = productData[location] ? productData[location].filter(item => 
        item.name.toLowerCase().includes(searchQuery)
    ) : [];

    if (filteredData.length > 0) {
        filteredData.sort((a, b) => a.price - b.price); // Sort by price (low to high)
        document.body.style.backgroundColor = "#90EE90"; // Light Green when match found
        filteredData.forEach(item => {
            let row = resultsTable.insertRow();
            row.insertCell(0).textContent = item.name;
            row.insertCell(1).textContent = `₹${item.price}`;
            row.insertCell(2).textContent = item.shop;
            row.insertCell(3).textContent = item.lastUpdated;
        });
    } else {
        document.body.style.backgroundColor = "#FF7F7F"; // Light Red when no match
    }
}
