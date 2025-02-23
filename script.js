// Live Updates from Firestore
db.collection("products").onSnapshot(snapshot => {
    let products = [];
    snapshot.docs.forEach(doc => {
        products.push(doc.data());
    });
    displayProducts(products);
});

// Search Function
function searchProduct() {
    let query = document.getElementById("search-box").value.toLowerCase();
    let selectedArea = document.getElementById("area-select").value;

    db.collection("products").get().then(snapshot => {
        let results = [];
        snapshot.docs.forEach(doc => {
            let product = doc.data();
            if (product.name.toLowerCase().includes(query)) {
                if (selectedArea === "all" || product.area.toLowerCase() === selectedArea.toLowerCase()) {
                    results.push(product);
                }
            }
        });

        displayProducts(results);
    });
}

// Display Products
function displayProducts(products) {
    let productList = document.getElementById("product-list");
    productList.innerHTML = "";

    products.forEach(product => {
        productList.innerHTML += `
            <tr>
                <td>${product.name}</td>
                <td>₹${product.price}</td>
                <td>${product.supplier}</td>
                <td>${product.area}</td>
                <td>${product.lastUpdated}</td>
            </tr>
        `;
    });
}
