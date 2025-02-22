// Product data with last update timestamps
let productsData = [
    { "name": "Sugar (1kg)", "price": 40, "supplier": "ABC Wholesaler", "area": "Mumbai", "lastUpdated": "2025-02-21 10:00 AM" },
    { "name": "Wheat Flour (5kg)", "price": 250, "supplier": "XYZ Traders", "area": "Delhi", "lastUpdated": "2025-02-21 09:30 AM" },
    { "name": "Rice (1kg)", "price": 55, "supplier": "Good Quality Stores", "area": "Bangalore", "lastUpdated": "2025-02-20 06:00 PM" },
    { "name": "Salt (1kg)", "price": 20, "supplier": "Fresh Groceries", "area": "Mumbai", "lastUpdated": "2025-02-20 04:45 PM" },
    { "name": "Cooking Oil (1L)", "price": 150, "supplier": "ABC Wholesaler", "area": "Delhi", "lastUpdated": "2025-02-19 02:15 PM" },
    { "name": "Sanchi Ghee (1L)", "price": 580, "supplier": "jain genral store", "area": "khokra", "lastUpdated": "2025-02-22 08:03 PM" },
    { "name": "Dal (1kg)", "price": 90, "supplier": "Organic Farms", "area": "Bangalore", "lastUpdated": "2025-02-18 11:30 AM" }
];

// Display products on page load
document.addEventListener("DOMContentLoaded", function () {
    displayProducts(productsData);
});

function displayProducts(products) {
    let productList = document.getElementById("productList");
    productList.innerHTML = "";

    products.forEach(product => {
        let productItem = document.createElement("div");
        productItem.classList.add("product");
        productItem.innerHTML = `
            <div class="product-details">
                <span class="product-name">${product.name}</span><br>
                <span class="product-supplier">Supplier: ${product.supplier} (${product.area})</span><br>
                <span class="product-update">Last Updated: ${product.lastUpdated}</span>
            </div>
            <span class="product-price">₹${product.price}</span>
        `;
        productList.appendChild(productItem);
    });
}

// Search with Auto-Suggestions & Background Color Change
function searchProduct() {
    let searchValue = document.getElementById("searchBox").value.toLowerCase();
    let suggestionsDiv = document.getElementById("suggestions");
    let matchingProducts = productsData.filter(product =>
        product.name.toLowerCase().includes(searchValue)
    );

    // Change background color
    let body = document.getElementById("body");
    if (searchValue === "") {
        body.style.backgroundColor = "#ADD8E6"; // Default Light Blue
    } else if (matchingProducts.length > 0) {
        body.style.backgroundColor = "#90EE90"; // Light Green (Match Found)
    } else {
        body.style.backgroundColor = "#FF7F7F"; // Light Red (No Match)
    }

    // Display Auto-Suggestions
    if (searchValue === "" || matchingProducts.length === 0) {
        suggestionsDiv.style.display = "none";
    } else {
        suggestionsDiv.innerHTML = "";
        matchingProducts.forEach(product => {
            let suggestionItem = document.createElement("div");
            suggestionItem.classList.add("suggestion-item");
            suggestionItem.textContent = product.name;
            suggestionItem.onclick = function () {
                document.getElementById("searchBox").value = product.name;
                displayProducts([product]); // Show only selected product
                suggestionsDiv.style.display = "none";
            };
            suggestionsDiv.appendChild(suggestionItem);
        });
        suggestionsDiv.style.display = "block";
    }
}

// Filter by Area
function filterByArea() {
    let selectedArea = document.getElementById("areaSelect").value;
    let filteredProducts = selectedArea === "all"
        ? productsData
        : productsData.filter(product => product.area === selectedArea);

    displayProducts(filteredProducts);
}
