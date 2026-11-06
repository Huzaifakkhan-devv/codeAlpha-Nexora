const API_URL = "http://localhost:5000/api/products";

const productForm = document.getElementById("add-product-form");
const imageInput = document.getElementById("product-image");
const imagePreview = document.getElementById("image-preview");
const formMessage = document.getElementById("form-message");

const token = localStorage.getItem("nexoraToken");
const savedUser = JSON.parse(
    localStorage.getItem("nexoraUser") || "null"
);

if (!token || !savedUser) {
    alert("Please login before submitting a product.");
    window.location.href = "login.html";
}

// Image Preview
imageInput.addEventListener("change", function () {
    const file = this.files[0];

    if (!file) {
        imagePreview.style.display = "none";
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        alert("Image must be smaller than 5 MB.");
        this.value = "";
        imagePreview.style.display = "none";
        return;
    }

    imagePreview.src = URL.createObjectURL(file);
    imagePreview.style.display = "block";
});

// Submit Product
productForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const formData = new FormData(productForm);
    const submitButton = productForm.querySelector("button");

    try {
        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";
        formMessage.textContent = "";

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Product could not be submitted.");
        }

        formMessage.textContent = data.message;
        formMessage.style.color = "green";

        productForm.reset();
        imagePreview.style.display = "none";

        submitButton.textContent = "Submitted";

    } catch (error) {
        console.error("Product submission error:", error);

        formMessage.textContent = error.message;
        formMessage.style.color = "red";

        submitButton.textContent = "Submit Product";

    } finally {
        submitButton.disabled = false;
    }
});