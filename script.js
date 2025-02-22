document.addEventListener("DOMContentLoaded", function () {
    loadProducts();
    document.getElementById("searchBox").addEventListener("keyup", searchProduct);
    document.getElementById("areaSelect").addEventListener("change", filterByArea);
    document.getElementById("updateForm").addEventListener("submit", addOrUpdateProduct);

    document.getElementById("adminLogin").addEventListener("click", adminLogin);
    document.getElementById("adminLogout").addEventListener("click", adminLogout);

    checkAdminStatus();
});

// ✅ Load Products from Local Storage
function loadProducts() {
    let storedProducts = localStorage.getItem("products");
    productsData = storedProducts ? JSON.parse(storedProducts) : [];
    displayProducts(productsData);
}

// ✅ Check Admin Login Status
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

// ✅ Admin Login Function
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

// ✅ Admin Logout Function
function adminLogout() {
    localStorage.removeItem("isAdmin");
    checkAdminStatus();
    alert("🚪 Logged Out Successfully!");
}

// ✅ Add or Update Only One Supplier's Price Without Affecting Others
function addOrUpdateProduct(event) {
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

    // ✅ Find if the product already exists for the same supplier & area
    let existingProductIndex = productsData.findIndex(
        (p) => p.name.toLowerCase() === name.toLowerCase() &&
               p.supplier.toLowerCase() === supplier.toLowerCase() &&
               p.area.toLowerCase() === area.toLowerCase()
    );

    if (existingProductIndex !== -1) {
        // ✅ Update the price of this supplier only (Does NOT overwrite others)
        productsData[existingProductIndex].price = price;
        productsData[existingProductIndex].lastUpdated = lastUpdated;
    } else {
        // ✅ Add a new product entry for this supplier & area
        productsData.push({ name, price, supplier, area, lastUpdated });
    }

    localStorage.setItem("products", JSON.stringify(productsData)); // Save to LocalStorage
    displayProducts(productsData);
    document.getElementById("updateForm").reset();
    alert("✅ Price Updated Successfully!");
}

// ✅ Display Products with Multiple Suppliers & Areas (Keep Comparison Feature)
function displayProducts(products) {
    let productList = document.getElementById("productList");
    productList.innerHTML = "";

    let groupedProducts = {};

    // Group products by name
    products.forEach((product) => {
        let productKey = product.name.toLowerCase();
        if (!groupedProducts[productKey]) {
            groupedProducts[productKey] = [];
        }
        groupedProducts[productKey].push(product);
    });

    for (let productName in groupedProducts) {
        let suppliersList = groupedProducts[productName]
            .sort((a, b) => a.price - b.price) // Sort by price (Lowest First)
            .map((product) =>
                `<div class="supplier">
                    <span class="product-supplier">Supplier: ${product.supplier} (${product.area})</span> |
                    <span class="product-price">₹${product.price}</span> |
                    <span class="product-update">Last Updated: ${product.lastUpdated}</span>
                </div>`
            )
            .join("");

        let productItem = document.createElement("div");
        productItem.classList.add("product");
        productItem.innerHTML = `
            <div class="product-title">
                <h3>${productName}</h3>
            </div>
            ${suppliersList}
        `;
        productList.appendChild(productItem);
    }
}

// ✅ Search Product and Change Background Color
function searchProduct() {
    let searchValue = document.getElementById("searchBox").value.toLowerCase();
    let filteredProducts = productsData.filter((product) => product.name.toLowerCase().includes(searchValue));

    if (searchValue === "") {
        document.body.style.backgroundColor = "#ADD8E6"; // Default ocean light blue
    } else if (filteredProducts.length > 0) {
        document.body.style.backgroundColor = "#90EE90"; // Light green for match found
    } else {
        document.body.style.backgroundColor = "#FF7F7F"; // Light red for no match
    }

    displayProducts(filteredProducts);
}

// ✅ Filter Products by Selected Area
function filterByArea() {
    let selectedArea = document.getElementById("areaSelect").value.toLowerCase();
    let filteredProducts = selectedArea === "all"
        ? productsData
        : productsData.filter((product) => product.area.toLowerCase() === selectedArea);

    displayProducts(filteredProducts);
}
