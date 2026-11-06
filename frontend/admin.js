const API = "http://localhost:5000/api";
const token = localStorage.getItem("nexoraToken");

const user = JSON.parse(
    localStorage.getItem("nexoraUser") || "null"
);

if (!token || !user || user.role !== "admin") {
    alert("Admin access only.");
    window.location.href = "index.html";
}

const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
};

async function loadAdminProducts() {
    const container = document.getElementById("admin-products");

    try {
        const response = await fetch(`${API}/products/admin/all`, {
            headers
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Could not load products.");
        }

        container.innerHTML = "";

        if (data.products.length === 0) {
            container.textContent = "No products found.";
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

            const seller = document.createElement("p");
            seller.textContent = product.seller
                ? `Seller: ${product.seller.name} (${product.seller.email})`
                : "Seller: Existing product";

            card.append(name, price, status, seller);

            if (product.status === "pending") {
                const approve = document.createElement("button");
                approve.textContent = "Approve";

                approve.addEventListener("click", () => {
                    reviewProduct(product._id, "approved");
                });

                const reject = document.createElement("button");
                reject.textContent = "Reject";

                reject.addEventListener("click", () => {
                    reviewProduct(product._id, "rejected");
                });

                card.append(approve, reject);
            }

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete Product";

            deleteButton.addEventListener("click", async () => {
                if (!confirm("Delete this product permanently?")) return;

                const result = await fetch(
                    `${API}/products/${product._id}`,
                    {
                        method: "DELETE",
                        headers
                    }
                );

                const resultData = await result.json();

                if (!result.ok || !resultData.success) {
                    alert(resultData.message || "Delete failed.");
                    return;
                }

                loadAdminProducts();
            });

            card.appendChild(deleteButton);
            container.appendChild(card);
        });

    } catch (error) {
        container.textContent = error.message;
    }
}

async function reviewProduct(id, status) {
    try {
        const response = await fetch(
            `${API}/products/${id}/review`,
            {
                method: "PATCH",
                headers,
                body: JSON.stringify({ status })
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Review failed.");
        }

        alert(data.message);
        loadAdminProducts();

    } catch (error) {
        alert(error.message);
    }
}

async function loadAdminOrders() {
    const container = document.getElementById("admin-orders");

    try {
        const response = await fetch(`${API}/orders`, {
            headers
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Could not load orders.");
        }

        container.innerHTML = "";

        if (data.orders.length === 0) {
            container.textContent = "No orders found.";
            return;
        }

        data.orders.forEach(order => {
            const card = document.createElement("div");
            card.className = "product-card";

            const customer = document.createElement("h3");
            customer.textContent = order.customer.name;

            const details = document.createElement("p");
            details.textContent =
                `Order: ${order._id} | Total: $${Number(order.total).toFixed(2)}`;

            const status = document.createElement("p");
            status.textContent = `Status: ${order.status}`;

            const select = document.createElement("select");

            [
                "Pending",
                "Confirmed",
                "Shipped",
                "Delivered",
                "Cancelled"
            ].forEach(value => {
                const option = document.createElement("option");
                option.value = value;
                option.textContent = value;
                select.appendChild(option);
            });

            select.value = order.status;

            const update = document.createElement("button");
            update.textContent = "Update Status";

            update.addEventListener("click", async () => {
                const result = await fetch(
                    `${API}/orders/${order._id}/status`,
                    {
                        method: "PATCH",
                        headers,
                        body: JSON.stringify({
                            status: select.value
                        })
                    }
                );

                const resultData = await result.json();

                if (!result.ok || !resultData.success) {
                    alert(resultData.message || "Update failed.");
                    return;
                }

                loadAdminOrders();
            });

            card.append(customer, details, status, select, update);
            container.appendChild(card);
        });

    } catch (error) {
        container.textContent = error.message;
    }
}

async function loadAdminUsers() {
    const container = document.getElementById("admin-users");

    try {
        const response = await fetch(`${API}/admin/users`, {
            headers
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Could not load users.");
        }

        container.innerHTML = "";

        if (data.users.length === 0) {
            container.textContent = "No users found.";
            return;
        }

        data.users.forEach(account => {
            const card = document.createElement("div");
            card.className = "product-card";

            const name = document.createElement("h3");
            name.textContent = account.name;

            const email = document.createElement("p");
            email.textContent = account.email;

            const role = document.createElement("p");
            role.textContent = `Role: ${account.role}`;

            card.append(name, email, role);

            if (account.role !== "admin") {
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete User";

                deleteButton.addEventListener("click", async () => {
                    if (!confirm(`Delete ${account.name}?`)) return;

                    const result = await fetch(
                        `${API}/admin/users/${account._id}`,
                        {
                            method: "DELETE",
                            headers
                        }
                    );

                    const resultData = await result.json();

                    if (!result.ok || !resultData.success) {
                        alert(resultData.message || "Delete failed.");
                        return;
                    }

                    loadAdminUsers();
                });

                card.appendChild(deleteButton);
            }

            container.appendChild(card);
        });

    } catch (error) {
        container.textContent = error.message;
    }
}

loadAdminProducts();
loadAdminOrders();
loadAdminUsers();