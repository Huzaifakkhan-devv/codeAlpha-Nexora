const API = "http://localhost:5000/api";
const token = localStorage.getItem("nexoraToken");

const user = JSON.parse(
    localStorage.getItem("nexoraUser") || "null"
);

if (!token || !user) {
    window.location.href = "login.html";
}

if (user && user.role === "admin") {
    window.location.href = "admin.html";
}

const welcome = document.getElementById("welcome");

if (welcome && user) {
    welcome.textContent = `Welcome, ${user.name}`;
}

async function loadMyProducts() {
    const container = document.getElementById("my-products");

    try {
        const response = await fetch(`${API}/products/mine`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Could not load products.");
        }

        container.innerHTML = "";

        if (data.products.length === 0) {
            container.textContent = "You have not listed any products yet.";
            return;
        }

        data.products.forEach(product => {
            const card = document.createElement("div");
            card.className = "product-card";

            const name = document.createElement("h3");
            name.textContent = product.name;

            const price = document.createElement("p");
            price.textContent = `$${Number(product.price).toFixed(2)}`;

            const status = document.createElement("p");
            status.textContent = `Status: ${product.status}`;

            card.append(name, price, status);

            if (product.status === "pending") {
                status.style.color = "orange";
            } else if (product.status === "approved") {
                status.style.color = "green";
            } else {
                status.style.color = "red";
            }

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete Listing";

            deleteButton.addEventListener("click", async () => {
                if (!confirm("Delete this product listing?")) return;

                const result = await fetch(
                    `${API}/products/${product._id}`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const resultData = await result.json();

                if (!result.ok || !resultData.success) {
                    alert(resultData.message || "Delete failed.");
                    return;
                }

                loadMyProducts();
            });

            card.appendChild(deleteButton);
            container.appendChild(card);
        });

    } catch (error) {
        container.textContent = error.message;
    }
}

async function loadMyOrders() {
    const container = document.getElementById("my-orders");

    try {
        const response = await fetch(`${API}/orders/mine`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Could not load orders.");
        }

        container.innerHTML = "";

        if (data.orders.length === 0) {
            container.textContent = "You have not placed any orders yet.";
            return;
        }

        data.orders.forEach(order => {
            const card = document.createElement("div");
            card.className = "product-card";

            const id = document.createElement("p");
            id.textContent = `Order: ${order._id}`;

            const total = document.createElement("p");
            total.textContent = `Total: $${Number(order.total).toFixed(2)}`;

            const status = document.createElement("p");
            status.textContent = `Status: ${order.status}`;

            const payment = document.createElement("p");
            payment.textContent = `Payment: ${order.paymentMethod}`;

            card.append(id, total, status, payment);
            container.appendChild(card);
        });

    } catch (error) {
        container.textContent = error.message;
    }
}

loadMyProducts();
loadMyOrders();