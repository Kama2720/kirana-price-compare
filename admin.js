// Admin Login
function adminLogin() {
    let email = document.getElementById("admin-email").value;
    let password = document.getElementById("admin-password").value;

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
        document.getElementById("login-section").style.display = "none";
        document.getElementById("admin-section").style.display = "block";
    })
    .catch(error => {
        alert("Login failed: " + error.message);
    });
}

// Update Product Price
function updatePrice() {
    let name = document.getElementById("product-name").value;
    let price = document.getElementById("new-price").value;
    let supplier = document.getElementById("supplier-name").value;
    let area = document.getElementById("area-name").value;
    let timestamp = new Date().toLocaleString();

    db.collection("products").add({
        name, price, supplier, area, lastUpdated: timestamp
    }).then(() => {
        alert("Price updated successfully!");
    }).catch(error => {
        console.error("Error updating price:", error);
    });
}
