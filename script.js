// ✅ Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// ✅ Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ✅ Search Function
function searchProduct() {
    let searchQuery = document.getElementById("search-box").value.toLowerCase();
    let selectedArea = document.getElementById("area-select").value;

    db.collection("products").get().then(snapshot => {
        let results = [];
        snapshot.docs.forEach(doc => {
            let product = doc.data();
            if (product.name.toLowerCase().includes(searchQuery)) {
                if (selectedArea === "all" || product.area === selectedArea) {
                    results.push(product);
                }
            }
        });

        displayProducts(results);
        changeBackgroundColor(results.length);
    });
}

// ✅ Display Search Results
function displayProducts(products) {
    let productList = document.getElementById("product-list");
    productList.innerHTML = "";

    if (products.length === 0) {
        productList.innerHTML = "<p>No products found.</p>";
        return;
    }

    products.forEach(product => {
        productList.innerHTML += `
            <div class="product-item">
                <p><strong>${product.name}</strong> - ₹${product.price}</p>
                <p>Supplier: ${product.supplier} | Area: ${product.area}</p>
                <p><small>Last Updated: ${product.lastUpdated}</small></p>
            </div>
        `;
    });
}

// ✅ Change Background Color Based on Search Result
function changeBackgroundColor(resultCount) {
    if (resultCount > 0) {
        document.body.style.backgroundColor = "lightgreen"; // Match found
    } else {
        document.body.style.backgroundColor = "lightcoral"; // No match
    }
}

// ✅ Toggle Admin Panel
function toggleAdminPanel() {
    document.getElementById("admin-panel").style.display = "block";
}

// ✅ Admin Login
function checkAdminLogin() {
    const enteredPassword = document.getElementById("admin-password").value;

    db.collection("settings").doc("admin").get().then((doc) => {
        if (doc.exists && enteredPassword === doc.data().adminPassword) {
            document.getElementById("admin-section").style.display = "block";
            alert("Admin login successful!");
        } else {
            alert("Incorrect password!");
        }
    }).catch(error => {
        console.error("Error fetching admin password:", error);
        alert("Error verifying password.");
    });
}

// ✅ Update Product Price
function updatePrice() {
    let productName = document.getElementById("product-name").value;
    let newPrice = document.getElementById("new-price").value;
    let supplierName = document.getElementById("supplier-name").value;
    let areaName = document.getElementById("area-name").value;

    db.collection("products").add({
        name: productName,
        price: parseFloat(newPrice),
        supplier: supplierName,
        area: areaName,
        lastUpdated: new Date().toLocaleString()
    }).then(() => {
        alert("Price updated successfully!");
        searchProduct(); // Refresh search
    }).catch(error => {
        console.error("Error updating price:", error);
    });
}
