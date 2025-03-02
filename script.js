// Firebase Setup
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Load Products
function loadProducts() {
    db.collection("products").orderBy("productName").onSnapshot((querySnapshot) => {
        let tableBody = document.getElementById("tableBody");
        tableBody.innerHTML = "";

        querySnapshot.forEach((doc) => {
            let data = doc.data();
            let row = `<tr>
                <td>${data.productName}</td>
                <td>₹${data.price}</td>
                <td>${data.supplier}</td>
                <td>${data.location}</td>
                <td>${new Date(data.lastUpdated.toDate()).toLocaleString()}</td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    });
}

// Filter Products on Search
function filterProducts() {
    let searchInput = document.getElementById("searchInput").value.toLowerCase();
    let rows = document.querySelectorAll("#productTable tbody tr");
    let found = false;

    rows.forEach((row) => {
        let product = row.cells[0].textContent.toLowerCase();
        if (product.includes(searchInput)) {
            row.style.display = "";
            found = true;
        } else {
            row.style.display = "none";
        }
    });

    document.body.style.backgroundColor = found ? "#90EE90" : "#FF7F7F";
}

// Toggle Admin Panel
function toggleAdminPanel() {
    document.getElementById("adminPanel").classList.toggle("hidden");
}

// Admin Login
function adminLogin() {
    let email = document.getElementById("adminEmail").value;
    let password = document.getElementById("adminPassword").value;

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            alert("Admin Logged In!");
            document.getElementById("updateSection").classList.remove("hidden");
        })
        .catch((error) => {
            alert("Login Failed: " + error.message);
        });
}

// Update Price for All Sellers
function updatePrice() {
    let productName = document.getElementById("updateProduct").value.trim().toLowerCase();
    let newPrice = parseFloat(document.getElementById("updatePrice").value);

    if (!productName || isNaN(newPrice)) {
        alert("Enter valid product name and price.");
        return;
    }

    db.collection("products").where("productName", "==", productName).get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                alert("No product found!");
                return;
            }

            let batch = db.batch();
            querySnapshot.forEach((doc) => {
                batch.update(doc.ref, {
                    price: newPrice,
                    lastUpdated: firebase.firestore.Timestamp.now()
                });
            });

            return batch.commit();
        })
        .then(() => {
            alert("Price updated for all suppliers!");
        })
        .catch((error) => {
            alert("Update failed: " + error.message);
        });
}

// Admin Logout
function adminLogout() {
    auth.signOut().then(() => {
        alert("Admin Logged Out!");
        document.getElementById("updateSection").classList.add("hidden");
    });
}

// Load products when page loads
window.onload = loadProducts;
