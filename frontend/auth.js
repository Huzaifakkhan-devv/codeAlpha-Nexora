
const AUTH_API = "http://localhost:5000/api/auth";

const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");
const message = document.getElementById("auth-message");

function showMessage(text, color) {
    if (!message) return;

    message.textContent = text;
    message.style.color = color;
}

// REGISTER
if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const button = registerForm.querySelector("button");
        button.disabled = true;
        button.textContent = "Registering...";

        try {
            const response = await fetch(`${AUTH_API}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: document.getElementById("name").value,
                    email: document.getElementById("email").value,
                    password: document.getElementById("password").value
                })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message);
            }

            localStorage.setItem("nexoraToken", data.token);
            localStorage.setItem("nexoraUser", JSON.stringify(data.user));

            showMessage("Registration successful!", "green");

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);

        } catch (error) {
            showMessage(error.message, "red");
        } finally {
            button.disabled = false;
            button.textContent = "Register";
        }
    });
}

// LOGIN
if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const button = loginForm.querySelector("button");
        button.disabled = true;
        button.textContent = "Logging in...";

        try {
            const response = await fetch(`${AUTH_API}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: document.getElementById("email").value,
                    password: document.getElementById("password").value
                })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message);
            }

            localStorage.setItem("nexoraToken", data.token);
            localStorage.setItem("nexoraUser", JSON.stringify(data.user));

            showMessage("Login successful!", "green");

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);

        } catch (error) {
            showMessage(error.message, "red");
        } finally {
            button.disabled = false;
            button.textContent = "Login";
        }
    });
}

// LOGOUT
function logoutUser() {
    localStorage.removeItem("nexoraToken");
    localStorage.removeItem("nexoraUser");

    window.location.href = "login.html";
}
