document.addEventListener("DOMContentLoaded", function () {
    loadProducts(); // Load products on page load

    document.getElementById("searchBox").addEventListener("keyup", searchProduct);
    document.getElementById("areaSelect").addEventListener("change", filterByArea);
    document.getElementById("updateForm").addEventListener("submit", addProduct);

    document.getElementById("adminLogin").addEventListener("click", adminLogin);
    document.getElementById("adminLogout").addEventListener("click", adminLogout);

    checkAdminStatus();
});

// Load Products from Local Storage
function loadProducts() {
    let storedProducts = localStorage.getItem("products");
    if (storedProducts) {
        productsData = JSON.parse(storedProducts);
    } else {
        productsData = [];
    }
    displayProducts(productsData);
}

// Check Admin Login Status
function checkAdminStatus() {
    if (localStorage.getItem("isAdmin") === "true") {
        document.getElementById("updateSection").style.display = "block";
        document.getElementById("adminLogin").style.display = "none";
        document.getElementById("adminLogout").style.display = "inline-block";
    } else {
        document.getElementById("updateSection").style.display = "none";
        document.getElementById("adminLogout").style.display = "none";
    }
}

// Admin Login Function
function adminLogin() {
    let username = prompt("Enter Admin Username:");
    let password = prompt("Enter Admin Password:");

    if (username === "admin" && password === "1234") {
        alert("✅ Admin Login Successful");
        localStorage.setItem("isAdmin", "true");
        checkAdminStatus();
    } else {
        alert("❌ Incorrect Credentials!");
    }
}

// Admin Logout Function
function adminLogout() {
    localStorage.removeItem("isAdmin");
    checkAdminStatus();
    alert("🚪 Logged Out Successfully!");
}

// ✅ Add or Update Product Prices (Admin Only)
function addProduct(event) {
    event.preventDefault();

    if (localStorage.getItem("isAdmin") !== "true") {
        alert("❌ Only Admin Can Update Prices!");
        return;
    }

    let name = document.getElementById("productName").value.trim();
    let price = parseFloat(document.getElementById("productPrice").value);
    let supplier = document.getElementById("supplierName").value.trim();
    let area = document.getElementById("productCity").value.trim();
    let lastUpdated = new Date().toLocaleString(); // Save Date & Time

    if (!name || !price || !supplier || !area) {
        alert("❌ Please fill all fields!");
        return;
    }

    let existingProduct = productsData.find(
        (p) => p.name.toLowerCase() === name.toLowerCase() && p.area.toLowerCase() === area.toLowerCase()
    );

    if (existingProduct) {
        existingProduct.price = price;
        existingProduct.supplier = supplier;
        existingProduct.lastUpdated = lastUpdated;
    } else {
        productsData.push({ name, price, supplier, area, lastUpdated });
    }

    localStorage.setItem("products", JSON.stringify(productsData)); // Save to LocalStorage
    displayProducts(productsData);
    document.getElementById("updateForm").reset();
    alert("✅ Price Updated Successfully!");
}

// ✅ Display Products with "Last Updated" Info
function displayProducts(products) {
    let productList = document.getElementById("productList");
    productList.innerHTML = "";

    products.forEach((product) => {
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

// ✅ Search Product and Change Background Color
function searchProduct() {
    let searchValue = document.getElementById("searchBox").value.toLowerCase();
    let productList = document.getElementById("productList");
    let products = productsData.filter((product) => product.name.toLowerCase().includes(searchValue));

    if (searchValue === "") {
        document.body.style.backgroundColor = "#ADD8E6"; // Default ocean light blue
    } else if (products.length > 0) {
        document.body.style.backgroundColor = "#90EE90"; // Light green for match found
    } else {
        document.body.style.backgroundColor = "#FF7F7F"; // Light red for no match
    }

    displayProducts(products);
}

// ✅ Filter Products by Selected Area
function filterByArea() {
    let selectedArea = document.getElementById("areaSelect").value.toLowerCase();
    let filteredProducts = selectedArea === "all"
        ? productsData
        : productsData.filter((product) => product.area.toLowerCase() === selectedArea);

    displayProducts(filteredProducts);
}
