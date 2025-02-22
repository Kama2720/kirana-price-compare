// Pre-set Admin Credentials (Change these later)
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "1234";

window.onload = function () {
    loadProducts(); // Load products from localStorage

    document.getElementById("searchBox").addEventListener("keyup", searchProduct);
    document.getElementById("areaSelect").addEventListener("change", filterByArea);
    document.getElementById("updateForm").addEventListener("submit", addProduct);

    // Admin Login
    document.getElementById("adminLogin").addEventListener("click", adminLogin);
    document.getElementById("adminLogout").addEventListener("click", adminLogout);

    checkAdminStatus();
};

// **Check if Admin is Logged In**
function checkAdminStatus() {
    if (localStorage.getItem("isAdmin") === "true") {
        document.getElementById("updateSection").style.display = "block";
        document.getElementById("adminLogin").style.display = "none";
        document.getElementById("adminLogout").style.display = "inline-block";
    } else {
        document.getElementById("updateSection").style.display = "none";
    }
}

// **Admin Login Function**
function adminLogin() {
    let username = prompt("Enter Admin Username:");
    let password = prompt("Enter Admin Password:");

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        alert("Admin Login Successful ✅");
        localStorage.setItem("isAdmin", "true");
        checkAdminStatus();
    } else {
        alert("❌ Incorrect Credentials!");
    }
}

// **Admin Logout Function**
function adminLogout() {
    localStorage.removeItem("isAdmin");
    checkAdminStatus();
    alert("Logged Out!");
}

// **Load Products from Local Storage**
let productsData = JSON.parse(localStorage.getItem("products")) || [
    { "name": "Sugar (1kg)", "price": 40, "supplier": "ABC Wholesaler", "area": "Mumbai", "lastUpdated": "2025-02-21 10:00 AM" },
    { "name": "Wheat Flour (5kg)", "price": 250, "supplier": "XYZ Traders", "area": "Delhi", "lastUpdated": "2025-02-21 09:30 AM" },
    { "name": "Rice (1kg)", "price": 55, "supplier": "Good Quality Stores", "area": "Bangalore", "lastUpdated": "2025-02-20 06:00 PM" }
];

function loadProducts() {
    displayProducts(productsData);
}

// **Function to Display Products**
function displayProducts(products) {
    let productList = document.getElementById("productList");
    productList.innerHTML = "";

    products.forEach((product, index) => {
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

    localStorage.setItem("products", JSON.stringify(products));
}

// **Function to Add or Update a Product (Admin Only)**
function addProduct(event) {
    event.preventDefault();

    if (localStorage.getItem("isAdmin") !== "true") {
        alert("❌ Only Admin Can Update Prices!");
        return;
    }

    let name = document.getElementById("productName").value;
    let price = parseFloat(document.getElementById("productPrice").value);
    let supplier = document.getElementById("supplierName").value;
    let area = document.getElementById("productCity").value;
    let lastUpdated = new Date().toLocaleString();

    let existingProduct = productsData.find(p => p.name.toLowerCase() === name.toLowerCase() && p.area.toLowerCase() === area.toLowerCase());

    if (existingProduct) {
        existingProduct.price = price;
        existingProduct.supplier = supplier;
        existingProduct.lastUpdated = lastUpdated;
    } else {
        productsData.push({ name, price, supplier, area, lastUpdated });
    }

    displayProducts(productsData);
    document.getElementById("updateForm").reset();
}

// **Function to Search Products by Name & Selected Area**
function searchProduct() {
    let searchValue = document.getElementById("searchBox").value.toLowerCase();
    let selectedArea = document.getElementById("areaSelect").value;

    let filteredProducts = productsData.filter(product =>
        product.name.toLowerCase().includes(searchValue) &&
        (selectedArea === "all" || product.area === selectedArea)
    );

    displayProducts(filteredProducts);
}

// **Function to Filter Products by Area**
function filterByArea() {
    let selectedArea = document.getElementById("areaSelect").value;
    let filteredProducts = selectedArea === "all"
        ? productsData
        : productsData.filter(product => product.area === selectedArea);
    displayProducts(filteredProducts);
}
