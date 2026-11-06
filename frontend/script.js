
// ========================================
// 1. API CONFIGURATION
// ========================================

const API_URL = "http://localhost:5000/api/products";
const IMAGE_BASE_URL = "http://localhost:5000";

function getImageUrl(imagePath) {
    if (!imagePath) {
        return "https://placehold.co/300x200?text=Product";
    }

    if (imagePath.startsWith("http")) {
        return imagePath;
    }

    return IMAGE_BASE_URL + (
        imagePath.startsWith("/") ? imagePath : "/" + imagePath
    );
}


// ========================================
// 2. LOAD CART FROM LOCAL STORAGE
// ========================================

let cart = [];

try {
    cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (!Array.isArray(cart)) {
        cart = [];
    }
} catch (error) {
    cart = [];
}

cart = cart.map(item => ({
    ...item,
    productId: item.productId || item._id || null,
    quantity: Math.max(1, Number(item.quantity) || 1),
    price: Number(item.price) || 0
}));


// ========================================
// 3. CART COUNTER AND SAVE
// ========================================

const cartCounter = document.getElementById("cart-count");

function updateCartCounter() {
    if (!cartCounter) return;

    const totalQuantity = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    cartCounter.textContent = `Cart (${totalQuantity})`;
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCounter();
}

updateCartCounter();


// ========================================
// 4. ADD PRODUCT TO CART
// ========================================

function addToCart(product) {
    const existingProduct = cart.find(item => {
        if (item.productId && product._id) {
            return item.productId === product._id;
        }

        return item.name === product.name;
    });

    if (existingProduct) {
        existingProduct.quantity++;
        existingProduct.productId =
            existingProduct.productId || product._id;
    } else {
        cart.push({
            productId: product._id || null,
            name: product.name,
            price: Number(product.price),
            image: product.image,
            quantity: 1
        });
    }

    saveCart();
    updateCart();

    alert(product.name + " added to cart!");
}


// ========================================
// 5. FETCH ALL PRODUCTS FROM DATABASE
// ========================================

async function fetchProducts() {
    const container = document.getElementById("product-container");

    if (!container) return;

    try {
        container.textContent = "Loading products...";

        const response = await fetch(API_URL);
        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Unable to load products");
        }

        displayProducts(data.products);

    } catch (error) {
        console.error("Product loading error:", error);

        container.textContent =
            "Products could not be loaded. Please check the backend server.";
    }
}


// ========================================
// 6. DISPLAY PRODUCTS ON HOMEPAGE
// ========================================

function displayProducts(products) {
    const container = document.getElementById("product-container");

    if (!container) return;

    container.innerHTML = "";

    if (!products || products.length === 0) {
        container.textContent = "No products available.";
        return;
    }

    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        const image = document.createElement("img");
        image.src = getImageUrl(product.image);
        image.alt = product.name;

        image.onerror = () => {
            image.onerror = null;
            image.src = "https://placehold.co/300x200?text=Product";
        };

        const name = document.createElement("h3");
        name.textContent = product.name;

        const price = document.createElement("p");
        price.textContent = "$" + Number(product.price).toFixed(2);

        const addButton = document.createElement("button");
        addButton.type = "button";
        addButton.textContent = "Add to Cart";

        addButton.addEventListener("click", () => {
            addToCart(product);
        });

        const detailsLink = document.createElement("a");
        detailsLink.href =
            "product.html?id=" + encodeURIComponent(product._id);
        detailsLink.textContent = "View Details";

        card.appendChild(image);
        card.appendChild(name);
        card.appendChild(price);
        card.appendChild(addButton);
        card.appendChild(detailsLink);

        container.appendChild(card);
    });
}


// ========================================
// 7. FETCH SINGLE PRODUCT DETAILS
// ========================================

async function fetchSingleProduct() {
    const detailName = document.getElementById("detail-name");

    if (!detailName) return;

    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    const detailPrice = document.getElementById("detail-price");
    const detailImage = document.getElementById("detail-image");
    const detailDescription =
        document.getElementById("detail-description");
    const detailCategory =
        document.querySelector(".product-category");
    const detailAddButton =
        document.getElementById("detail-add-button");

    if (!productId) {
        detailName.textContent = "Product ID is missing";
        return;
    }

    try {
        detailName.textContent = "Loading product...";

        const response = await fetch(
            `${API_URL}/${encodeURIComponent(productId)}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Product not found");
        }

        const product = data.product;

        detailName.textContent = product.name;
        detailPrice.textContent =
            "$" + Number(product.price).toFixed(2);

        detailImage.src = getImageUrl(product.image);
        detailImage.alt = product.name;

        detailImage.onerror = () => {
            detailImage.onerror = null;
            detailImage.src =
                "https://placehold.co/500x400?text=Product";
        };

        detailDescription.textContent = product.description;

        if (detailCategory) {
            detailCategory.textContent = product.category;
        }

        if (detailAddButton) {
            detailAddButton.disabled = false;

            detailAddButton.addEventListener("click", () => {
                addToCart(product);
            });
        }

    } catch (error) {
        console.error("Product details error:", error);

        detailName.textContent = "Product could not be loaded";
        detailDescription.textContent = error.message;

        if (detailAddButton) {
            detailAddButton.disabled = true;
        }
    }
}


// ========================================
// 8. RENDER CART PAGE
// ========================================

function updateCart() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    if (!cartItems || !cartTotal) return;

    cartItems.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {
        cartItems.textContent = "Your cart is empty.";
    }

    cart.forEach((product, index) => {
        const item = document.createElement("div");
        item.className = "cart-item";

        const image = document.createElement("img");
        image.src = getImageUrl(product.image);
        image.alt = product.name;
        image.className = "cart-product-image";

        image.onerror = () => {
            image.onerror = null;
            image.src = "https://placehold.co/100x100?text=Product";
        };

        const name = document.createElement("h3");
        name.textContent = product.name;

        const price = document.createElement("p");
        price.textContent = "$" + product.price.toFixed(2);

        const quantityBox = document.createElement("div");
        quantityBox.className = "quantity-box";

        const decrease = document.createElement("button");
        decrease.type = "button";
        decrease.textContent = "-";
        decrease.setAttribute("aria-label", "Decrease quantity");

        decrease.addEventListener("click", () => {
            if (product.quantity > 1) {
                product.quantity--;
                saveCart();
                updateCart();
            }
        });

        const quantity = document.createElement("span");
        quantity.textContent = product.quantity;

        const increase = document.createElement("button");
        increase.type = "button";
        increase.textContent = "+";
        increase.setAttribute("aria-label", "Increase quantity");

        increase.addEventListener("click", () => {
            product.quantity++;
            saveCart();
            updateCart();
        });

        quantityBox.appendChild(decrease);
        quantityBox.appendChild(quantity);
        quantityBox.appendChild(increase);

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.textContent = "Remove";

        removeButton.addEventListener("click", () => {
            cart.splice(index, 1);
            saveCart();
            updateCart();
        });

        item.appendChild(image);
        item.appendChild(name);
        item.appendChild(price);
        item.appendChild(quantityBox);
        item.appendChild(removeButton);

        cartItems.appendChild(item);

        total += product.price * product.quantity;
    });

    cartTotal.textContent = "$" + total.toFixed(2);

    updateCartCounter();
}


// ========================================
// 9. CART CHECKOUT BUTTON
// ========================================

const checkoutButton = document.getElementById("checkout-button");

if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Your cart is empty. Please add products first.");
            return;
        }

        window.location.href = "checkout.html";
    });
}


// ========================================
// 10. CHECKOUT ORDER SUMMARY
// ========================================

function renderCheckoutSummary() {
    const checkoutItems = document.getElementById("checkout-items");
    const checkoutSubtotal =
        document.getElementById("checkout-subtotal");

    if (!checkoutItems || !checkoutSubtotal) return;

    checkoutItems.innerHTML = "";

    let subtotal = 0;

    if (cart.length === 0) {
        checkoutItems.textContent = "Your cart is empty.";
        checkoutSubtotal.textContent = "$0.00";

        const button = document.getElementById("place-order-button");

        if (button) button.disabled = true;

        return;
    }

    cart.forEach(product => {
        const row = document.createElement("div");
        row.className = "checkout-item";

        const name = document.createElement("span");
        name.textContent =
            `${product.name} × ${product.quantity}`;

        const price = document.createElement("strong");
        const lineTotal = product.price * product.quantity;
        price.textContent = "$" + lineTotal.toFixed(2);

        row.appendChild(name);
        row.appendChild(price);

        checkoutItems.appendChild(row);

        subtotal += lineTotal;
    });

    checkoutSubtotal.textContent = "$" + subtotal.toFixed(2);
}


// ========================================
// 11. COD CHECKOUT AND ORDER PLACEMENT
// ========================================

const checkoutForm = document.getElementById("checkout-form");

if (checkoutForm) {
    checkoutForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        if (!checkoutForm.reportValidity()) return;

        const formData = new FormData(checkoutForm);

        const customer = {
            name: formData.get("customerName").trim(),
            phone: formData.get("phone").trim(),
            email: formData.get("email").trim(),
            address: formData.get("address").trim(),
            city: formData.get("city").trim(),
            notes: formData.get("notes").trim()
        };

        const paymentMethod = formData.get("paymentMethod");

        if (paymentMethod !== "COD") {
            alert("Please select Cash on Delivery.");
            return;
        }

        const orderData = {
            customer,
            paymentMethod: "COD",
            items: cart.map(product => ({
                productId: product.productId,
                quantity: product.quantity
            }))
        };

        const submitButton = document.getElementById("place-order-button");
        const message = document.getElementById("checkout-message");

        try {
            submitButton.disabled = true;
            submitButton.textContent = "Placing Order...";
            message.textContent = "";

            const token = localStorage.getItem("nexoraToken");

            if (!token) {
            alert("Please login before placing an order.");
            window.location.href = "login.html";
            return;
            }

            const response = await fetch("http://localhost:5000/api/orders", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
                },
            body: JSON.stringify(orderData)
        });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Order could not be placed.");
            }

            localStorage.setItem(
                "lastNexoraOrder",
                JSON.stringify(data.order)
            );

            cart = [];
            saveCart();

            updateCart();
            renderCheckoutSummary();

            checkoutForm.reset();

            message.textContent =
                `Order placed successfully! Order ID: ${data.order._id}. Payment: Cash on Delivery.`;

            message.className = "success-message";

            submitButton.textContent = "Order Placed";

        } catch (error) {
            console.error("Order placement error:", error);

            message.textContent = error.message;
            message.className = "error-message";

            submitButton.disabled = false;
            submitButton.textContent = "Place Order";
        }
    });
}


// ========================================
// 12. INITIALIZE PAGES
// ========================================

fetchProducts();
fetchSingleProduct();
updateCart();
renderCheckoutSummary();
