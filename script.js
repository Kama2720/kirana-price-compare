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
const auth = firebase.auth();

let isAdmin = false; // Track admin login state

// ✅ Admin Login Function
function adminLogin() {
    let email = document.getElementById("adminEmail").value;
    let password = document.getElementById("adminPassword").value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            isAdmin = true;
            document.getElementById("adminStatus").innerText = "✅ Logged in as Admin";
            alert("✅ Admin Logged In Successfully!");
            searchProduct();
        })
        .catch((error) => {
            alert("❌ Login Failed: " + error.message);
        });
}

// ✅ Admin Logout Function
function adminLogout() {
    auth.signOut().then(() => {
        isAdmin = false;
        document.getElementById("adminStatus").innerText = "Not logged in";
        alert("✅ Admin Logged Out!");
        searchProduct();
    });
}

// ✅ Search Product & Filter by Area
function searchProduct() {
    let searchQuery = document.getElementById("searchInput").value.trim().toLowerCase();
    let selectedArea = document.getElementById("areaSelect").value;
    let results = [];

    if (!searchQuery) {
        alert("❌ Please enter a product name!");
        return;
    }

    db.collection("products").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let product = doc.data();

            if (product.name.toLowerCase().includes(searchQuery)) {
                if (selectedArea === "all" || product.area === selectedArea) {
                    results.push({ id: doc.id, ...product });
                }
            }
        });

        displayProducts(results);
    });
}

// ✅ Display Products & Allow Admin to Update Prices
function displayProducts(products) {
    let resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = "";

    if (products.length === 0) {
        resultsContainer.innerHTML = "<p>❌ No results found!</p>";
        return;
    }

    let productMap = {};

    products.forEach((product) => {
        let key = `${product.name}-${product.area}`;

        if (!productMap[key]) {
            productMap[key] = {
                name: product.name,
                area: product.area,
                suppliers: []
            };
        }

        productMap[key].suppliers.push({
            id: product.id,
            supplier: product.supplier,
            price: product.price,
            lastUpdated: product.lastUpdated
        });
    });

    // ✅ Display Grouped Products
    for (let key in productMap) {
        let productData = productMap[key];

        let productHTML = `
            <div class="product-card">
                <h3>${productData.name} - ${productData.area}</h3>
                <table>
                    <tr>
                        <th>Supplier</th>
                        <th>Price</th>
                        <th>Last Updated</th>
                        ${isAdmin ? "<th>Update Price</th>" : ""}
                    </tr>`;

        productData.suppliers.forEach((supplier) => {
            productHTML += `
                <tr>
                    <td>${supplier.supplier}</td>
                    <td>₹${supplier.price}</td>
                    <td>${supplier.lastUpdated}</td>
                    ${isAdmin ? `
                        <td>
                            <input type="number" id="price-${supplier.id}" value="${supplier.price}">
                            <button onclick="updatePrice('${supplier.id}')">Update</button>
                        </td>
                    ` : ""}
                </tr>`;
        });

        productHTML += `</table></div>`;
        resultsContainer.innerHTML += productHTML;
    }
}

// ✅ Admin Updates Price in Firestore
function updatePrice(productId) {
    let newPrice = document.getElementById(`price-${productId}`).value;
    let timestamp = new Date().toLocaleString();

    db.collection("products").doc(productId).update({
        price: newPrice,
        lastUpdated: timestamp
    }).then(() => {
        alert("✅ Price updated successfully!");
        searchProduct();
    }).catch((error) => {
        console.error("❌ Error updating price: ", error);
    });
}
